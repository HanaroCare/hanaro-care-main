package com.server.common.s3;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

  String save(MultipartFile file) throws IOException;

  String getUrl(String key);

  void delete(String key) throws IOException;
}
