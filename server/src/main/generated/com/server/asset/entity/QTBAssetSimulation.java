package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBAssetSimulation is a Querydsl query type for TBAssetSimulation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBAssetSimulation extends EntityPathBase<TBAssetSimulation> {

    private static final long serialVersionUID = -991923686L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBAssetSimulation tBAssetSimulation = new QTBAssetSimulation("tBAssetSimulation");

    public final com.server.common.entity.QBaseCreatedEntity _super = new com.server.common.entity.QBaseCreatedEntity(this);

    public final StringPath ageRangeDetails = createString("ageRangeDetails");

    public final NumberPath<java.math.BigDecimal> careCost = createNumber("careCost", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> livingCost = createNumber("livingCost", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> medicalCost = createNumber("medicalCost", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> monthlyCost = createNumber("monthlyCost", java.math.BigDecimal.class);

    public final NumberPath<Long> simulationId = createNumber("simulationId", Long.class);

    public final NumberPath<Integer> targetAge = createNumber("targetAge", Integer.class);

    public final com.server.user.entity.QTBUser user;

    public QTBAssetSimulation(String variable) {
        this(TBAssetSimulation.class, forVariable(variable), INITS);
    }

    public QTBAssetSimulation(Path<? extends TBAssetSimulation> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBAssetSimulation(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBAssetSimulation(PathMetadata metadata, PathInits inits) {
        this(TBAssetSimulation.class, metadata, inits);
    }

    public QTBAssetSimulation(Class<? extends TBAssetSimulation> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

