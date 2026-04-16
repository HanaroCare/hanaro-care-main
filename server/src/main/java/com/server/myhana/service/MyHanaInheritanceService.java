package com.server.myhana.service;

import com.server.common.annotation.CheckUser;
import com.server.myhana.dto.ContractDto;
import com.server.myhana.dto.FamilySummaryDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.repository.FamilyAuthRepository;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyHanaInheritanceService {

  private final FamilyAuthRepository familyAuthRepository;

  // 가족 조회
  @CheckUser(key = "#userId")
  @Cacheable(value = "familyList", key = "#userId")
  public List<FamilySummaryDto> getFamily(Long userId) {
    List<TBFamilyAuth> families = familyAuthRepository.findAllByGrantorUserId(userId);
    return families.stream().map(f -> FamilySummaryDto.builder().name(f.getGrantee().getUserNm())
        .phoneNumber(f.getGrantee().getUserPhone()).relationCd(f.getRelationCd().name())
        .build()).toList();
  }

  // 계약서 생성하기
  @CheckUser(key = "#userId")
  public byte[] generateContract(Long userId, ContractDto dto) throws Exception {
    try (InputStream template = getClass().getResourceAsStream("/templates/contract.docx")) {
      if (template == null) {
        throw new IllegalStateException("contract.docx template not found");
      }
      try (XWPFDocument doc = new XWPFDocument(template);
          ByteArrayOutputStream out = new ByteArrayOutputStream()) {

        for (XWPFParagraph para : doc.getParagraphs()) {
          for (XWPFRun run : para.getRuns()) {
            String text = run.getText(0);
            if (text != null) {
              text = text.replace("{{date}}",
                  LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
              text = text.replace("{{user_name}}", dto.getUserName());
              text = text.replace("{{user_phone}}", dto.getUserPhone());
              text = text.replace("{{guardian_name}}", dto.getGuardianName());
              text = text.replace("{{guardian_relation}}", dto.getGuardianRelation());
              text = text.replace("{{permission1}}", dto.getPermission()[0] ? "○" : "");
              text = text.replace("{{permission2}}", dto.getPermission()[1] ? "○" : "");
              text = text.replace("{{permission3}}", dto.getPermission()[2] ? "○" : "");
              text = text.replace("{{permission4}}", dto.getPermission()[3] ? "○" : "");
              text = text.replace("{{permission5}}", dto.getPermission()[4] ? "○" : "");

              run.setText(text, 0);
            }
          }
        }
        doc.write(out);
        return out.toByteArray();
      }
    }
  }
}
