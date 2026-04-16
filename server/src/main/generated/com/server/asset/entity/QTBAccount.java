package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBAccount is a Querydsl query type for TBAccount
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBAccount extends EntityPathBase<TBAccount> {

    private static final long serialVersionUID = -601903568L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBAccount tBAccount = new QTBAccount("tBAccount");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final NumberPath<Long> accountId = createNumber("accountId", Long.class);

    public final StringPath accountNm = createString("accountNm");

    public final StringPath accountNum = createString("accountNum");

    public final EnumPath<com.server.asset.entity.enums.AssetCategory> assetCateCd = createEnum("assetCateCd", com.server.asset.entity.enums.AssetCategory.class);

    public final NumberPath<java.math.BigDecimal> balanceAmt = createNumber("balanceAmt", java.math.BigDecimal.class);

    public final DatePath<java.time.LocalDate> contrDt = createDate("contrDt", java.time.LocalDate.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DatePath<java.time.LocalDate> expireDt = createDate("expireDt", java.time.LocalDate.class);

    public final StringPath instNm = createString("instNm");

    public final NumberPath<java.math.BigDecimal> limitAmt = createNumber("limitAmt", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> monthlyPremAmt = createNumber("monthlyPremAmt", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> payAmt = createNumber("payAmt", java.math.BigDecimal.class);

    public final NumberPath<Integer> payDay = createNumber("payDay", Integer.class);

    public final NumberPath<java.math.BigDecimal> profitRate = createNumber("profitRate", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final com.server.user.entity.QTBUser user;

    public QTBAccount(String variable) {
        this(TBAccount.class, forVariable(variable), INITS);
    }

    public QTBAccount(Path<? extends TBAccount> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBAccount(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBAccount(PathMetadata metadata, PathInits inits) {
        this(TBAccount.class, metadata, inits);
    }

    public QTBAccount(Class<? extends TBAccount> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

