package com.server.user.repository;

import com.server.user.entity.TBUserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBUserLoginLogRepository extends JpaRepository<TBUserLoginLog, Long> {

}
