package com.server.inheritance.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTBInheritLetter is a Querydsl query type for TBInheritLetter
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTBInheritLetter extends EntityPathBase<TBInheritLetter> {

    private static final long serialVersionUID = 869533994L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTBInheritLetter tBInheritLetter = new QTBInheritLetter("tBInheritLetter");

    public final com.server.common.entity.QBaseEntity _super = new com.server.common.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final QTBInheritDetail inheritDetail;

    public final StringPath letterCont = createString("letterCont");

    public final NumberPath<Long> letterId = createNumber("letterId", Long.class);

    public final EnumPath<com.server.inheritance.enums.LetterType> letterTypeCd = createEnum("letterTypeCd", com.server.inheritance.enums.LetterType.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final StringPath voiceUrl = createString("voiceUrl");

    public QTBInheritLetter(String variable) {
        this(TBInheritLetter.class, forVariable(variable), INITS);
    }

    public QTBInheritLetter(Path<? extends TBInheritLetter> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTBInheritLetter(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTBInheritLetter(PathMetadata metadata, PathInits inits) {
        this(TBInheritLetter.class, metadata, inits);
    }

    public QTBInheritLetter(Class<? extends TBInheritLetter> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.inheritDetail = inits.isInitialized("inheritDetail") ? new QTBInheritDetail(forProperty("inheritDetail"), inits.get("inheritDetail")) : null;
    }

}

