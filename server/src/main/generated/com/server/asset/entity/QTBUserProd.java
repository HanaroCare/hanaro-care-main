package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBUserProd is a Querydsl query type for TBUserProd
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBUserProd extends EntityPathBase<TBUserProd> {

    private static final long serialVersionUID = 391414303L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBUserProd tBUserProd = new QTBUserProd("tBUserProd");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final com.server.user.entity.QTBUser claimAgent;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final EnumPath<com.server.asset.entity.enums.InvestType> investType = createEnum("investType", com.server.asset.entity.enums.InvestType.class);

    public final BooleanPath isAgentView = createBoolean("isAgentView");

    public final NumberPath<java.math.BigDecimal> monthlyPayout = createNumber("monthlyPayout", java.math.BigDecimal.class);

    public final StringPath payoutSettings = createString("payoutSettings");

    public final EnumPath<com.server.asset.entity.enums.PayoutType> payoutType = createEnum("payoutType", com.server.asset.entity.enums.PayoutType.class);

    public final NumberPath<Byte> period = createNumber("period", Byte.class);

    public final NumberPath<java.math.BigDecimal> principalAmount = createNumber("principalAmount", java.math.BigDecimal.class);

    public final EnumPath<com.server.asset.entity.enums.ProdStat> prodStat = createEnum("prodStat", com.server.asset.entity.enums.ProdStat.class);

    public final EnumPath<com.server.asset.entity.enums.ProdType> prodType = createEnum("prodType", com.server.asset.entity.enums.ProdType.class);

    public final QTBProduct product;

    public final NumberPath<java.math.BigDecimal> profit = createNumber("profit", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> profitRate = createNumber("profitRate", java.math.BigDecimal.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final EnumPath<com.server.asset.entity.enums.StartType> startType = createEnum("startType", com.server.asset.entity.enums.StartType.class);

    public final QTBRealAsset targetAsset;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final com.server.user.entity.QTBUser user;

    public final NumberPath<Long> userProdId = createNumber("userProdId", Long.class);

    public QTBUserProd(String variable) {
        this(TBUserProd.class, forVariable(variable), INITS);
    }

    public QTBUserProd(Path<? extends TBUserProd> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBUserProd(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBUserProd(PathMetadata metadata, PathInits inits) {
        this(TBUserProd.class, metadata, inits);
    }

    public QTBUserProd(Class<? extends TBUserProd> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.claimAgent = inits.isInitialized("claimAgent") ? new com.server.user.entity.QTBUser(forProperty("claimAgent")) : null;
        this.product = inits.isInitialized("product") ? new QTBProduct(forProperty("product")) : null;
        this.targetAsset = inits.isInitialized("targetAsset") ? new QTBRealAsset(forProperty("targetAsset"), inits.get("targetAsset")) : null;
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

