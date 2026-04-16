package com.server.common.s3;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Profile({"local", "default"})
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {

  @Value("${voice.upload-dir}")
  private String uploadDir;

  @Value("${voice.base-url}")
  private String baseUrl;

  @Override
  public String save(MultipartFile file) throws IOException {
    String filename = UUID.randomUUID() + ".webm";
    Path savePath = Paths.get(uploadDir).resolve(filename);
    Files.createDirectories(savePath.getParent());
    Files.copy(file.getInputStream(), savePath);
    return filename;
  }

  @Override
  public String getUrl(String key) {
    return baseUrl + key;
  }

  @Override
  public void delete(String key) throws IOException {
    Files.deleteIfExists(Paths.get(uploadDir).resolve(key));
  }
}
