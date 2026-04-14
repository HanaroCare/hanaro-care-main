package com.server.myhana.service;

import com.server.myhana.dto.ContractDto;
import com.server.myhana.dto.FamilySummaryDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.repository.TBFamilyAuthRepository;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InheritanceService {

  private final TBFamilyAuthRepository familyAuthRepository;

  // 가족 조회
  public List<FamilySummaryDto> getFamily(Long userId) {
    List<TBFamilyAuth> families = familyAuthRepository.findAllByGrantorUserId(userId);
    return families.stream().map(f -> FamilySummaryDto.builder().name(f.getGrantee().getUserNm())
        .phoneNumber(f.getGrantee().getUserPhone()).relationCd(f.getRelationCd().name())
        .build()).toList();
  }

  // TODO: 계약서 생성하기
  public byte[] generateContract(ContractDto dto) throws Exception {
    // 템플릿 파일 로드 (resources 폴더에 넣어두기)
    InputStream template = getClass().getResourceAsStream("/templates/contract.docx");
    XWPFDocument doc = new XWPFDocument(template);

    // 모든 단락 순회하며 치환
    for (XWPFParagraph para : doc.getParagraphs()) {
      for (XWPFRun run : para.getRuns()) {
        String text = run.getText(0);
        if (text != null) {
          text = text.replace("{{user_name}}", dto.getUserName());
          text = text.replace("{{user_phone}}", dto.getUserPhone());
          text = text.replace("{{guardian_name}}", dto.getGuardianName());
          text = text.replace("{{guardian_relation}}", dto.getGuardianRelation());
          text = text.replace("{{permission1}}", dto.getPermission()[0]);
          text = text.replace("{{permission2}}", dto.getPermission()[1]);
          text = text.replace("{{permission3}}", dto.getPermission()[2]);
          text = text.replace("{{permission4}}", dto.getPermission()[3]);
          text = text.replace("{{permission5}}", dto.getPermission()[4]);
          run.setText(text, 0);
        }
      }
    }

    // byte[]로 반환 (다운로드용)
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    doc.write(out);
    return out.toByteArray();
  }
}
