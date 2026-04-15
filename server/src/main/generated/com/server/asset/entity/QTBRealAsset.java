package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBRealAsset is a Querydsl query type for TBRealAsset
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBRealAsset extends EntityPathBase<TBRealAsset> {

    private static final long serialVersionUID = -1988811979L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBRealAsset tBRealAsset = new QTBRealAsset("tBRealAsset");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    public final StringPath addr = createString("addr");

    public final EnumPath<com.server.asset.entity.enums.RealAssetCategory> assetCateCd = createEnum("assetCateCd", com.server.asset.entity.enums.RealAssetCategory.class);

    public final StringPath assetDesc = createString("assetDesc");

    public final StringPath assetNm = createString("assetNm");

    public final NumberPath<java.math.BigDecimal> assetSize = createNumber("assetSize", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> evalAmt = createNumber("evalAmt", java.math.BigDecimal.class);

    public final NumberPath<Long> realAssetId = createNumber("realAssetId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final com.server.user.entity.QTBUser user;

    public QTBRealAsset(String variable) {
        this(TBRealAsset.class, forVariable(variable), INITS);
    }

    public QTBRealAsset(Path<? extends TBRealAsset> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBRealAsset(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBRealAsset(PathMetadata metadata, PathInits inits) {
        this(TBRealAsset.class, metadata, inits);
    }

    public QTBRealAsset(Class<? extends TBRealAsset> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.server.user.entity.QTBUser(forProperty("user")) : null;
    }

}

