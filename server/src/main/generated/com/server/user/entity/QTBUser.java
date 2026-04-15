package com.server.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTBUser is a Querydsl query type for TBUser
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBUser extends EntityPathBase<TBUser> {

    private static final long serialVersionUID = 670668095L;

    public static final QTBUser tBUser = new QTBUser("tBUser");

    public final EnumPath<com.server.user.enums.LoginMeans> authMeansCd = createEnum("authMeansCd", com.server.user.enums.LoginMeans.class);

    public final BooleanPath isHanaCert = createBoolean("isHanaCert");

    public final DateTimePath<java.time.LocalDateTime> lastLoginAt = createDateTime("lastLoginAt", java.time.LocalDateTime.class);

    public final StringPath loginId = createString("loginId");

    public final DateTimePath<java.time.LocalDateTime> pwdChangedAt = createDateTime("pwdChangedAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> userAge = createNumber("userAge", Integer.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final StringPath userNm = createString("userNm");

    public final StringPath userPhone = createString("userPhone");

    public final StringPath userPwd = createString("userPwd");

    public final EnumPath<com.server.user.enums.SubscriberRole> userRole = createEnum("userRole", com.server.user.enums.SubscriberRole.class);

    public final EnumPath<com.server.user.enums.UserStatus> userStatusCd = createEnum("userStatusCd", com.server.user.enums.UserStatus.class);

    public QTBUser(String variable) {
        super(TBUser.class, forVariable(variable));
    }

    public QTBUser(Path<? extends TBUser> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTBUser(PathMetadata metadata) {
        super(TBUser.class, metadata);
    }

}

