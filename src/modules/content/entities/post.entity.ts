import { BaseEntity } from "@/modules/database/base/entity";
import { PostBodyType } from "@/modules/database/constants";
import { Exclude, Expose, Type } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { CommentEntity } from "./comment.entity";

// src/modules/content/entities/post.entity.ts
@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid') // 格式： 550e8400-e29b-41d4-a716-446655440000
    id!: string;

    @Expose()
    @Column({ comment: '文章标题' })
    @Index({ fulltext: true })
    title!: string;
    
    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'longtext' })
    @Index({ fulltext: true })
    body!: string;

    @Expose()
    @Column({ comment: '文章描述', nullable: true })
    @Index({ fulltext: true })
    summary?: string;

    @Expose()
    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Expose()
    @Column({
        comment: '文章类型',
        type: 'enum',
        enum: PostBodyType,
        default: PostBodyType.MD,
    })
    type!: PostBodyType;

    @Expose()
    @Column({
        comment: '发布时间',
        type: 'varchar',
        nullable: true,
    })
    publishedAt?: Date | null;

    @Expose()
    @Column({ comment: '文章排序', default: 0 })
    customOrder!: number;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;

    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '更新时间',
    })
    updatedAt!: Date;

    @ManyToMany(() => CategoryEntity, (category) => category.posts, {
      // 在新增文章时,如果所属分类不存在则直接创建
      cascade: true, // true 表示支持("insert" | "update" | "remove" | "soft-remove" | "recover")
    })
    // 多对多关联时，关联的一侧(比如这里的PostEntity的categories)必须加上@JoinTable装饰器
    @JoinTable() 
    categories?: CategoryEntity[];


    @OneToMany((type) => CommentEntity, (comment) => comment.post, {
        cascade: true,
    })
    comments!: CommentEntity[];

    @Expose()
    commentCount!: number;


    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date;
}