package com.server.asset.repository;

import com.server.asset.entity.TBAccount;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TBAccountRepository extends JpaRepository<TBAccount, Long> {
    @Query("SELECT a FROM TBAccount a WHERE a.user.userId = :userId")
    List<TBAccount> findByUserId(Long userId);
}
