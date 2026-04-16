package com.server.common.s3;

import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
//@Profile("prod")
@Primary
@RequiredArgsConstructor
public class S3StorageService implements StorageService {

  private final S3Client s3Client;

  @Value("${cloud.aws.s3.bucket.private}")
  private String bucket;

  @Value("${cloud.aws.s3.voice-prefix:voice/}")
  private String voicePrefix;


  @Override
  public String save(MultipartFile file) throws IOException {
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
    return s3Client.utilities()
        .getUrl(GetUrlRequest.builder().bucket(bucket).key(key).build())
        .toString();
  }

  @Override
  public void delete(String key) {
    s3Client.deleteObject(
        DeleteObjectRequest.builder().bucket(bucket).key(key).build()
    );
  }
}
