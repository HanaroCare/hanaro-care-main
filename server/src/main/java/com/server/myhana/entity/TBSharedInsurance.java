package com.server.myhana.entity;

import com.server.asset.entity.TBAccount;
import com.server.common.entity.BaseEntity;
import com.server.user.entity.TBUser;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "TB_SHARED_INSURANCE")
public class TBSharedInsurance extends BaseEntity {

  @Id
  @Tsid
  @Column(name = "SHARED_INS_ID", columnDefinition = "bigint unsigned")
  private Long sharedInsId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "GRANTOR_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_SharedInsurance_grantorId_User"))
  private TBUser grantor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "GRANTEE_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_SharedInsurance_granteeId_User"))
  private TBUser grantee;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ACCOUNT_ID", referencedColumnName = "ACCOUNT_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_SharedInsurance_accountId_Account"))
  private TBAccount insurance;
}
