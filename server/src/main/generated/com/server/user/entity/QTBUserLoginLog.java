package com.server.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBUserLoginLog is a Querydsl query type for TBUserLoginLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBUserLoginLog extends EntityPathBase<TBUserLoginLog> {

    private static final long serialVersionUID = -321461894L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBUserLoginLog tBUserLoginLog = new QTBUserLoginLog("tBUserLoginLog");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final StringPath accessDevNm = createString("accessDevNm");

    public final StringPath accessIpAddr = createString("accessIpAddr");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final BooleanPath isSuccess = createBoolean("isSuccess");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final QTBUser user;

    public final NumberPath<Long> userLogId = createNumber("userLogId", Long.class);

    public final EnumPath<com.server.user.enums.LoginMeans> userMeansCd = createEnum("userMeansCd", com.server.user.enums.LoginMeans.class);

    public QTBUserLoginLog(String variable) {
        this(TBUserLoginLog.class, forVariable(variable), INITS);
    }

    public QTBUserLoginLog(Path<? extends TBUserLoginLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBUserLoginLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBUserLoginLog(PathMetadata metadata, PathInits inits) {
        this(TBUserLoginLog.class, metadata, inits);
    }

    public QTBUserLoginLog(Class<? extends TBUserLoginLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QTBUser(forProperty("user")) : null;
    }

}

