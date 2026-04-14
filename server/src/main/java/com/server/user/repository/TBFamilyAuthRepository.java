package com.server.user.repository;

import com.server.user.entity.TBFamilyAuth;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBFamilyAuthRepository extends JpaRepository<TBFamilyAuth, Long> {

	Optional<TBFamilyAuth> findByGrantor_UserIdAndGrantee_UserId(
		Long grantorUserId,
		Long granteeUserId
	);
}
