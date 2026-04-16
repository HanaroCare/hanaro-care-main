package com.server.inheritance.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBInheritDetail is a Querydsl query type for TBInheritDetail
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBInheritDetail extends EntityPathBase<TBInheritDetail> {

    private static final long serialVersionUID = 640482645L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBInheritDetail tBInheritDetail = new QTBInheritDetail("tBInheritDetail");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> distRatio = createNumber("distRatio", java.math.BigDecimal.class);

    public final NumberPath<Long> inheritDetailId = createNumber("inheritDetailId", Long.class);

    public final QTBInheritLetter inheritLetter;

    public final QTBInheritPlan inheritPlan;

    public final EnumPath<com.server.inheritance.enums.FamilyRelation> relationCd = createEnum("relationCd", com.server.inheritance.enums.FamilyRelation.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final com.server.user.entity.QTBUser user;

    public QTBInheritDetail(String variable) {
        this(TBInheritDetail.class, forVariable(variable), INITS);
    }

    public QTBInheritDetail(Path<? extends TBInheritDetail> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBInheritDetail(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBInheritDetail(PathMetadata metadata, PathInits inits) {
        this(TBInheritDetail.class, metadata, inits);
    }

    public QTBInheritDetail(Class<? extends TBInheritDetail> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.inheritLetter = inits.isInitialized("inheritLetter") ? new QTBInheritLetter(forProperty("inheritLetter"), inits.get("inheritLetter")) : null;
        this.inheritPlan = inits.isInitialized("inheritPlan") ? new QTBInheritPlan(forProperty("inheritPlan"), inits.get("inheritPlan")) : null;
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

