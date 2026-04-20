package com.server.common.s3;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
//@Profile("prod")
@Primary
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class S3StorageService implements StorageService {

  private final S3Client s3Client;
  private final S3Presigner s3Presigner;

  @Value("${cloud.aws.s3.bucket.private}")
  private String bucket;

  @Value("${cloud.aws.s3.voice-prefix:voice/}")
  private String voicePrefix;

  @jakarta.annotation.PostConstruct
  public void init() {
    log.info("[S3StorageService] Initialized with bucket: {}, prefix: {}", bucket, voicePrefix);
  }


  @Override
  public String save(MultipartFile file) throws IOException {
    log.info("[S3StorageService] Saving file to bucket: {}, key: {}", bucket, file.getOriginalFilename());
    String key = voicePrefix + UUID.randomUUID() + ".webm";
    s3Client.putObject(
        PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(file.getContentType())
            .contentLength(file.getSize())
            .build(),
        RequestBody.fromInputStream(file.getInputStream(), file.getSize())
    );
    return key;
  }

  @Override
  public String getUrl(String key) {
    PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(
        GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(10))
            .getObjectRequest(GetObjectRequest.builder().bucket(bucket).key(key).build())
            .build()
    );
    return presigned.url().toString();
  }

  @Override
  public void delete(String key) {
    s3Client.deleteObject(
        DeleteObjectRequest.builder().bucket(bucket).key(key).build()
    );
  }
}
