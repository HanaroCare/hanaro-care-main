package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBTrustSimulation is a Querydsl query type for TBTrustSimulation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBTrustSimulation extends EntityPathBase<TBTrustSimulation> {

    private static final long serialVersionUID = -687299710L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBTrustSimulation tBTrustSimulation = new QTBTrustSimulation("tBTrustSimulation");

    public final com.server.common.entity.QBaseCreatedEntity _super = new com.server.common.entity.QBaseCreatedEntity(this);

    public final com.server.user.entity.QTBUser claimAgent;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final EnumPath<com.server.asset.entity.enums.InvestType> investType = createEnum("investType", com.server.asset.entity.enums.InvestType.class);

    public final StringPath payoutSettings = createString("payoutSettings");

    public final EnumPath<com.server.asset.entity.enums.PayoutType> payoutType = createEnum("payoutType", com.server.asset.entity.enums.PayoutType.class);

    public final NumberPath<java.math.BigDecimal> principalAmount = createNumber("principalAmount", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> startDate = createDateTime("startDate", java.time.LocalDateTime.class);

    public final EnumPath<com.server.asset.entity.enums.StartType> startType = createEnum("startType", com.server.asset.entity.enums.StartType.class);

    public final NumberPath<Long> trustSimulationId = createNumber("trustSimulationId", Long.class);

    public final com.server.user.entity.QTBUser user;

    public QTBTrustSimulation(String variable) {
        this(TBTrustSimulation.class, forVariable(variable), INITS);
    }

    public QTBTrustSimulation(Path<? extends TBTrustSimulation> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBTrustSimulation(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBTrustSimulation(PathMetadata metadata, PathInits inits) {
        this(TBTrustSimulation.class, metadata, inits);
    }

    public QTBTrustSimulation(Class<? extends TBTrustSimulation> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.claimAgent = inits.isInitialized("claimAgent") ? new com.server.user.entity.QTBUser(forProperty("claimAgent")) : null;
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

