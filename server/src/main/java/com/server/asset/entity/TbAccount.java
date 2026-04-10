package com.server.asset.entity;

import io.hypersistence.utils.hibernate.id.Tsid;import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TbAccount {
	@Id
	@Tsid
	@Column(columnDefinition = "bigint unsigned")
	private Long id;
}
