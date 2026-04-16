package com.server.common.controller;

import com.server.common.security.dto.SubscriberDTO;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@RestController
@RequestMapping("/apis/files")
@RequiredArgsConstructor
public class FilesController {

  private static final List<String> allowedTypes = List.of("images/jpeg", "images/png");
  private final S3Presigner s3Presigner;

  @Value("${cloud.aws.s3.bucket.public}")
  private String publicBucket;

  @Value("${cloud.aws.s3.bucket.private}")
  private String privateBucket;

  @GetMapping("/upload-url/static")
  public String getUploadUrl(@RequestParam String fileName, @RequestParam String contentType) {
    return uploadUrl("static/" + uniqName(fileName), contentType, true);
  }

  @GetMapping("/upload-url")
  public String getUploadUrlBySpringSecurity(@AuthenticationPrincipal SubscriberDTO user,
      @RequestParam String fileName, @RequestParam String contentType) {
    if (user == null) {
      throw new AuthorizationDeniedException("Not Logined!");
    }

    String key = "users/%s/%s".formatted(user.getUsername(), uniqName(fileName));
    return uploadUrl(key, contentType, false);
  }

  private String uploadUrl(String key, String contentType, boolean isPublic) {
    if (!allowedTypes.contains(contentType) || !contentType.startsWith("image")) {
      throw new IllegalArgumentException("허용되지 않는 파일 형식입니다.");
    }

    PutObjectPresignRequest request = PutObjectPresignRequest.builder()
        .signatureDuration(Duration.ofMinutes(10))
        .putObjectRequest(r -> r.bucket(isPublic ? publicBucket : privateBucket)
            .key(key).contentType(contentType)).build();

    return s3Presigner.presignPutObject(request).url().toString();
  }

  @PostMapping("/upload-urls")
  public String[] getUploadUrls(@AuthenticationPrincipal SubscriberDTO user,
      @RequestBody FilesReq filesReq) {
    return filesReq.files().stream().map(file -> {
      String key = "users/%s/%s".formatted(user.getUsername(), uniqName(file.fileName()));
      return uploadUrl(key, file.contentType(), false);
    }).toArray(String[]::new);
  }

  @GetMapping("/download-url")
  public String getDownloadUrl(
      @AuthenticationPrincipal UserDetails user,
      @RequestParam String fileName) {
    String key = "users/%s/%s".formatted(user.getUsername(),
        fileName);
    return downloadUrl(key, false);
  }

  @GetMapping("/download-url/static")
  public String getDownloadUrlStatic(@RequestParam String fileName) {
    return downloadUrl("static/" + fileName, true);
  }

  private String downloadUrl(String key, boolean isPublic) {
    GetObjectPresignRequest request = GetObjectPresignRequest.builder()
        .signatureDuration(Duration.ofMinutes(1))
        .getObjectRequest(r -> r.bucket(isPublic ? publicBucket : privateBucket).key(key))
        .build();

    return s3Presigner.presignGetObject(request).url().toString();
  }

  private String uniqName(String fileName) {
    return UUID.randomUUID() + "_" + fileName;
  }

}
