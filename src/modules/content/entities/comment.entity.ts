import { BaseEntity } from "@/modules/database/base/entity";
import { Exclude, Expose, Type } from "class-transformer";
import { Tree, Entity, ManyToOne, TreeParent, OneToMany, PrimaryGeneratedColumn, TreeChildren, Column, CreateDateColumn } from "typeorm";
import { PostEntity } from './post.entity';

// src/modules/content/entities/comment.entity.ts
@Exclude()
@Tree('materialized-path') // 在模型顶部添加@Tree装饰器，并且传入materialized-path，这就构建了一个MP的树形嵌套结构
@Entity('content_comments')
export class CommentEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ comment: '评论内容', type: 'longtext' })
    body: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;

    @Expose()
    depth = 0;

    @Expose()
    @ManyToOne((type) => PostEntity, (post) => post.comments, {
        // 文章不能为空
        nullable: false,
        // 跟随父表删除与更新
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post: PostEntity;

    @TreeParent({ onDelete: 'CASCADE' })
    parent: CommentEntity | null;
    
    @Expose()
    @TreeChildren({ cascade: true })
    children: CommentEntity[];
}
