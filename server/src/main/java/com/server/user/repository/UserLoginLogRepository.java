package com.server.user.repository;

import com.server.user.entity.TBUserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLoginLogRepository extends JpaRepository<TBUserLoginLog, Long> {

}
