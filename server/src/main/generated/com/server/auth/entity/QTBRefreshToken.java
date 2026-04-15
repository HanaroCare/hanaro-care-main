package com.server.auth.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBRefreshToken is a Querydsl query type for TBRefreshToken
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBRefreshToken extends EntityPathBase<TBRefreshToken> {

    private static final long serialVersionUID = 1614494575L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBRefreshToken tBRefreshToken = new QTBRefreshToken("tBRefreshToken");

    public final DateTimePath<java.time.LocalDateTime> expiryDt = createDateTime("expiryDt", java.time.LocalDateTime.class);

    public final StringPath tokenValue = createString("tokenValue");

    public final com.server.user.entity.QTBUser user;

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QTBRefreshToken(String variable) {
        this(TBRefreshToken.class, forVariable(variable), INITS);
    }

    public QTBRefreshToken(Path<? extends TBRefreshToken> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBRefreshToken(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBRefreshToken(PathMetadata metadata, PathInits inits) {
        this(TBRefreshToken.class, metadata, inits);
    }

    public QTBRefreshToken(Class<? extends TBRefreshToken> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

