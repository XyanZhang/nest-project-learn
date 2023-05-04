import { PostEntity } from "./entities/post.entity";

export type PostSearchBody = Pick<ClassToPlain<PostEntity>, 'title' | 'body' | 'summary'> & {
  categories: string;
};