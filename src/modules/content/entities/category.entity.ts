import { Exclude, Expose, Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { PostEntity } from './post.entity';

/* 
关联实现
  需要注意的是，正如typeorm官网文档里说的一样，在定义反向关系的时候我们需要遵循以下规则
  ● 多对多关联时，关联的一侧(比如这里的PostEntity的categories)必须加上@JoinTable装饰器
  ● 一对多关联时(反向关联为多对一)，两侧都不需要加任何东西
  ● 一对一关联时(本节课没用到)，关联的一侧必须要加上@JoinColumn装饰器 
*/

// src/modules/content/entities/category.entity.ts
@Exclude()
@Tree('materialized-path')
@Entity('content_categories')
export class CategoryEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ comment: '分类名称' })
  name!: string;

  @Expose({ groups: ['category-tree', 'category-list', 'category-detail'] })
  @Column({ comment: '分类排序', default: 0 })
  customOrder!: number;

  @Expose({ groups: ['category-list'] })
  depth = 0;

  @Expose({ groups: ['category-detail', 'category-list'] })
  @Type(() => CategoryEntity)
  @TreeParent({ onDelete: 'NO ACTION' })
  parent!: CategoryEntity | null;

  @Expose({ groups: ['category-tree'] })
  @Type(() => CategoryEntity)
  @TreeChildren({ cascade: true })
  children!: CategoryEntity[];

  @ManyToMany((type) => PostEntity, (post) => post.categories)
  posts!: PostEntity[];
}

/* 
● insert action 会在你创建文章时，如果添加一些没有保存到数据库的分类模型对象，那么这些分类会自动在保存文章时被保存到数据库
● update action 会在你更新文章时，同样的会把没有保存到数据库的分类，但添加到文章对象的分类给保存进数据库
● remove action 一般用在一对一或者一对多关联，比如在你删除文章时同时删除文章下的评论
● soft-remove和recover是用于软删除和恢复的，这部分内容我们会留到后面的课时再讲
*/
