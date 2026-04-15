package com.server.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBFamilyAuth is a Querydsl query type for TBFamilyAuth
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBFamilyAuth extends EntityPathBase<TBFamilyAuth> {

    private static final long serialVersionUID = -213508704L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBFamilyAuth tBFamilyAuth = new QTBFamilyAuth("tBFamilyAuth");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final BooleanPath authStatus = createBoolean("authStatus");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> familyAuthId = createNumber("familyAuthId", Long.class);

    public final QTBUser grantee;

    public final QTBUser grantor;

    public final BooleanPath isCardView = createBoolean("isCardView");

    public final BooleanPath isInsView = createBoolean("isInsView");

    public final BooleanPath isProxyClaim = createBoolean("isProxyClaim");

    public final BooleanPath isTrustView = createBoolean("isTrustView");

    public final EnumPath<com.server.user.enums.FamilyRelation> relationCd = createEnum("relationCd", com.server.user.enums.FamilyRelation.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTBFamilyAuth(String variable) {
        this(TBFamilyAuth.class, forVariable(variable), INITS);
    }

    public QTBFamilyAuth(Path<? extends TBFamilyAuth> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBFamilyAuth(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBFamilyAuth(PathMetadata metadata, PathInits inits) {
        this(TBFamilyAuth.class, metadata, inits);
    }

    public QTBFamilyAuth(Class<? extends TBFamilyAuth> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.grantee = inits.isInitialized("grantee") ? new QTBUser(forProperty("grantee")) : null;
        this.grantor = inits.isInitialized("grantor") ? new QTBUser(forProperty("grantor")) : null;
    }

}

