package com.server.asset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTBProduct is a Querydsl query type for TBProduct
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBProduct extends EntityPathBase<TBProduct> {

    private static final long serialVersionUID = 265941234L;

    public static final QTBProduct tBProduct = new QTBProduct("tBProduct");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final EnumPath<com.server.asset.entity.enums.ProdCate> prodCate = createEnum("prodCate", com.server.asset.entity.enums.ProdCate.class);

    public final StringPath prodDesc = createString("prodDesc");

    public final StringPath prodNm = createString("prodNm");

    public final NumberPath<Long> productId = createNumber("productId", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTBProduct(String variable) {
        super(TBProduct.class, forVariable(variable));
    }

    public QTBProduct(Path<? extends TBProduct> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTBProduct(PathMetadata metadata) {
        super(TBProduct.class, metadata);
    }

}

