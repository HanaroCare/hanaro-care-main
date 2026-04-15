package com.server.inheritance.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBInheritPlan is a Querydsl query type for TBInheritPlan
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBInheritPlan extends EntityPathBase<TBInheritPlan> {

    private static final long serialVersionUID = -1800085203L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBInheritPlan tBInheritPlan = new QTBInheritPlan("tBInheritPlan");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> estiTaxAmt = createNumber("estiTaxAmt", java.math.BigDecimal.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<java.math.BigDecimal> totalInheritAmt = createNumber("totalInheritAmt", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final com.server.user.entity.QTBUser user;

    public QTBInheritPlan(String variable) {
        this(TBInheritPlan.class, forVariable(variable), INITS);
    }

    public QTBInheritPlan(Path<? extends TBInheritPlan> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBInheritPlan(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBInheritPlan(PathMetadata metadata, PathInits inits) {
        this(TBInheritPlan.class, metadata, inits);
    }

    public QTBInheritPlan(Class<? extends TBInheritPlan> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

