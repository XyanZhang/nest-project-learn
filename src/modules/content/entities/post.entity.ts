import { PostBodyType } from "@/modules/database/constants";
import { Exclude, Expose, Type } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// src/modules/content/entities/post.entity.ts
@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid') // 格式： 550e8400-e29b-41d4-a716-446655440000
    id!: string;

    @Expose()
    @Column({ comment: '文章标题' })
    title!: string;
    
    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'longtext' })
    body!: string;

    @Expose()
    @Column({ comment: '文章描述', nullable: true })
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
}