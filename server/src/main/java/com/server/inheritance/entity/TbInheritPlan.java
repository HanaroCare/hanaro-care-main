package com.server.inheritance.entity;

import java.math.BigDecimal;

import com.server.common.entity.BaseEntity;
import com.server.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "INHERIT_PLAN", uniqueConstraints = {
    @UniqueConstraint(
        name = "unique_TbInheritPlan_userId",
        columnNames = {"USER_ID"}
    )
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class TbInheritPlan extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "INHERIT_PLAN_ID", columnDefinition = "bigint unsigned")
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "USER_ID",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_TbInheritPlan_userId_TbUser")
  )
  private User user;

  @Builder.Default
  @Column(name = "TOTAL_INHERIT_AMT", precision = 16, scale = 2, nullable = false, columnDefinition = "DECIMAL(16,2) DEFAULT 0")
  private BigDecimal totalInheritAmt = BigDecimal.ZERO;

  @Builder.Default
  @Column(name = "ESTI_TAX_AMT", precision = 16, scale = 2, nullable = false, columnDefinition = "DECIMAL(16,2) DEFAULT 0")
  private BigDecimal estiTaxAmt = BigDecimal.ZERO;

}
