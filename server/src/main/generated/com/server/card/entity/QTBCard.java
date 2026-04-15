package com.server.card.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBCard is a Querydsl query type for TBCard
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBCard extends EntityPathBase<TBCard> {

    private static final long serialVersionUID = 874911497L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBCard tBCard = new QTBCard("tBCard");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final com.server.asset.entity.QTBAccount account;

    public final NumberPath<java.math.BigDecimal> autoTransAmt = createNumber("autoTransAmt", java.math.BigDecimal.class);

    public final NumberPath<Long> cardId = createNumber("cardId", Long.class);

    public final StringPath cardNm = createString("cardNm");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final BooleanPath isUse = createBoolean("isUse");

    public final NumberPath<java.math.BigDecimal> limitAmt = createNumber("limitAmt", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTBCard(String variable) {
        this(TBCard.class, forVariable(variable), INITS);
    }

    public QTBCard(Path<? extends TBCard> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBCard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBCard(PathMetadata metadata, PathInits inits) {
        this(TBCard.class, metadata, inits);
    }

    public QTBCard(Class<? extends TBCard> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.account = inits.isInitialized("account") ? new com.server.asset.entity.QTBAccount(forProperty("account"), inits.get("account")) : null;
    }

}

