import { CustomRepository } from "@/modules/database/repository.decorator";
import { FindTreeOptions, SelectQueryBuilder, TreeRepository } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";

// src/modules/content/repositories/comment.repository.ts
type FindCommentTreeOptions = FindTreeOptions & {
  addQuery?: (query: SelectQueryBuilder<CommentEntity>) => SelectQueryBuilder<CommentEntity>;
};

@CustomRepository(CommentEntity)
export class CommentRepository extends TreeRepository<CommentEntity> {
  /**
   * 构建基础查询器
   */
  buildBaseQB(qb: SelectQueryBuilder<CommentEntity>): SelectQueryBuilder<CommentEntity> {
      return qb
          .leftJoinAndSelect(`comment.parent`, 'parent')
          .leftJoinAndSelect(`comment.post`, 'post')
          .orderBy('comment.createdAt', 'DESC');
  }

  /**
   * 查询树
   * @param options
   */
  async findTrees(options: FindCommentTreeOptions = {}) {
      options.relations = ['parent', 'children'];
      const roots = await this.findRoots(options);
      await Promise.all(roots.map((root) => this.findDescendantsTree(root, options)));
      return roots;
  }

  /**
   * 查询顶级评论
   * @param options
   */
  findRoots(options: FindCommentTreeOptions = {}) {
      // ...
      let qb = this.buildBaseQB(this.createQueryBuilder('comment'));
      // ...
      qb = addQuery ? addQuery(qb) : qb;
      return qb.getMany();
  }

  /**
   * 创建后代查询器
   * @param closureTableAlias
   * @param entity
   * @param options
   */
  createDtsQueryBuilder(
      closureTableAlias: string,
      entity: CommentEntity,
      options: FindCommentTreeOptions = {},
  ): SelectQueryBuilder<CommentEntity> {
      const { addQuery } = options;
      const qb = this.buildBaseQB(
          super.createDescendantsQueryBuilder('comment', closureTableAlias, entity),
      );
      return addQuery ? addQuery(qb) : qb;
  }

  /**
   * 查询后代树
   * @param entity
   * @param options
   */
  async findDescendantsTree(
      entity: CommentEntity,
      options: FindCommentTreeOptions = {},
  // ): Promise<CommentEntity> {
  ): Promise<any> {
      const qb: SelectQueryBuilder<CommentEntity> = this.createDtsQueryBuilder(
          'treeClosure',
          entity,
          options,
      );
     // ...
  }

  async toFlatTrees(trees: CommentEntity[], depth = 0) {
      // ..
  }
}

function addQuery(qb: SelectQueryBuilder<CommentEntity>): SelectQueryBuilder<CommentEntity> {
  throw new Error("Function not implemented.");
}
