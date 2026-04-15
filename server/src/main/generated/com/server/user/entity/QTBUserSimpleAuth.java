package com.server.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBUserSimpleAuth is a Querydsl query type for TBUserSimpleAuth
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBUserSimpleAuth extends EntityPathBase<TBUserSimpleAuth> {

    private static final long serialVersionUID = 645957913L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBUserSimpleAuth tBUserSimpleAuth = new QTBUserSimpleAuth("tBUserSimpleAuth");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final EnumPath<com.server.user.enums.LoginMeans> authMeansCd = createEnum("authMeansCd", com.server.user.enums.LoginMeans.class);

    public final StringPath authValue = createString("authValue");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> simpleAuthId = createNumber("simpleAuthId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final QTBUser user;

    public QTBUserSimpleAuth(String variable) {
        this(TBUserSimpleAuth.class, forVariable(variable), INITS);
    }

    public QTBUserSimpleAuth(Path<? extends TBUserSimpleAuth> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBUserSimpleAuth(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBUserSimpleAuth(PathMetadata metadata, PathInits inits) {
        this(TBUserSimpleAuth.class, metadata, inits);
    }

    public QTBUserSimpleAuth(Class<? extends TBUserSimpleAuth> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QTBUser(forProperty("user")) : null;
    }

}

