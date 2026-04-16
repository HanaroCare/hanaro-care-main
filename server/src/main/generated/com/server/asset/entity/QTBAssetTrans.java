package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBAssetTrans is a Querydsl query type for TBAssetTrans
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBAssetTrans extends EntityPathBase<TBAssetTrans> {

    private static final long serialVersionUID = -1192745291L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBAssetTrans tBAssetTrans = new QTBAssetTrans("tBAssetTrans");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> transAmt = createNumber("transAmt", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> transDt = createDateTime("transDt", java.time.LocalDateTime.class);

    public final NumberPath<Long> transId = createNumber("transId", Long.class);

    public final EnumPath<com.server.asset.entity.enums.TransStat> transStat = createEnum("transStat", com.server.asset.entity.enums.TransStat.class);

    public final EnumPath<com.server.asset.entity.enums.TransType> transType = createEnum("transType", com.server.asset.entity.enums.TransType.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final QTBUserProd userProd;

    public QTBAssetTrans(String variable) {
        this(TBAssetTrans.class, forVariable(variable), INITS);
    }

    public QTBAssetTrans(Path<? extends TBAssetTrans> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBAssetTrans(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBAssetTrans(PathMetadata metadata, PathInits inits) {
        this(TBAssetTrans.class, metadata, inits);
    }

    public QTBAssetTrans(Class<? extends TBAssetTrans> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.userProd = inits.isInitialized("userProd") ? new QTBUserProd(forProperty("userProd"), inits.get("userProd")) : null;
    }

}

