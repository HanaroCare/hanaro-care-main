package com.server.user.repository;

import com.server.user.entity.TBUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TBUserRepository extends JpaRepository<TBUser, Long> {
}
