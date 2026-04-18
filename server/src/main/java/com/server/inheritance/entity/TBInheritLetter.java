package com.server.inheritance.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.server.common.entity.BaseEntity;
import com.server.inheritance.enums.LetterType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_INHERIT_LETTER")
public class TBInheritLetter extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "LETTER_ID",
      columnDefinition = "bigint unsigned")
  private Long letterId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "INHERIT_DETAIL_ID", referencedColumnName = "INHERIT_DETAIL_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_InheritLetter_inheritDetailId_InheritDetail"
      ))
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JsonBackReference
  private TBInheritDetail inheritDetail;

  @Column(name = "LETTER_TYPE_CD")
  @Enumerated(EnumType.STRING)
  private LetterType letterTypeCd;

  @Column(name = "LETTER_CONT", length = 500)
  private String letterCont;

  @Column(name = "VOICE_URL", length = 500)
  private String voiceUrl;

}
