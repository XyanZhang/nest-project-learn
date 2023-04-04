// src/modules/database/constants.ts

export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

// src/modules/content/constants.ts
 /**
 * 文章内容类型
 */
 export enum PostBodyType {
  HTML = 'html',
  MD = 'markdown',
}

/**
* 文章排序类型
*/
export enum PostOrderType {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
  PUBLISHED = 'publishedAt',
  CUSTOM = 'custom',
}

/**
 * 软删除数据查询类型
 */
export enum SelectTrashMode {
  ALL = 'all', 
  ONLY = 'only', 
  NONE = 'none', 
}