package com.server.user.entity;

import com.server.common.entity.BaseEntity;
import com.server.user.enums.LoginMeans;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "TB_USER_SIMPLE_AUTH")
public class TBUserSimpleAuth extends BaseEntity {

	@Id
	@Tsid
	@Column(name = "SIMPLE_AUTH_ID", columnDefinition = "bigint unsigned")
	private Long simpleAuthId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "USER_ID",
		referencedColumnName = "USER_ID",
		columnDefinition = "bigint unsigned not null",
		foreignKey = @ForeignKey(name = "fk_UserSimpleAuth_userId_User")
	)
	private TBUser user;

	@Enumerated(EnumType.STRING)
	@Column(name = "AUTH_MEANS_CD", nullable = false, length = 20)
	private LoginMeans authMeansCd;

	@Column(name = "AUTH_VALUE", nullable = false, length = 255)
	private String authValue;

}
