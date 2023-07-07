// src/modules/database/types.ts

import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * 分页验证DTO接口
 */
export interface IPaginateDto<C extends PaginateMeta = PaginateMeta> {
  // extends Omit<PaginateOptions<C>, 'page' | 'limit'> {
  page: number;
  limit: number;
}

/**
 * 为queryBuilder添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
  qb: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

// src/modules/database/types.ts
/**
 * 分页原数据
 */
export interface PaginateMeta {
  /**
   * 当前页项目数量
   */
  itemCount: number;
  /**
   * 项目总数量
   */
  totalItems?: number;
  /**
   * 每页显示数量
   */
  perPage: number;
  /**
   * 总页数
   */
  totalPages?: number;
  /**
   * 当前页数
   */
  currentPage: number;
}
/**
 * 分页选项
 */
export interface PaginateOptions {
  /**
   * 当前页数
   */
  page: number;
  /**
   * 每页显示数量
   */
  limit: number;
}

/**
 * 分页返回数据
 */
export interface PaginateReturn<E extends ObjectLiteral> {
  meta: PaginateMeta;
  items: E[];
}

/**
 * 排序方式
 */
export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}
/**
 * 排序类型,{字段名称: 排序方法}
 * 如果多个值则传入数组即可
 * 排序方法不设置,默认DESC
 */
export type OrderQueryType =
  | string
  | { name: string; order: `${OrderType}` }
  | Array<{ name: string; order: `${OrderType}` } | string>;
