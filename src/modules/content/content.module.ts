import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../database/database.module";
import { PostController } from "./controllers/post.controller";
import { PostEntity } from "./entities/post.entity";
import { PostRepository } from "./repositories/post.repository";
import { SanitizeService } from "./repositories/services/sanitize.service";
import { PostService } from "./services/post.service";
import { PostSubscriber } from "./subscribers/post.subscriber";
import { CategoryEntity } from './entities/category.entity';
import { CommentEntity } from './entities/comment.entity';

// 解释一下
// 1. TypeOrmModule.forFeature([PostEntity, CategoryEntity, CommentEntity])，这个是为模块注册实体
// 2. DatabaseModule.forRepository([PostRepository])，这个是为模块注册仓库
// 3. exports: [PostService, DatabaseModule.forRepository([PostRepository])], 这个是为模块导出服务和仓库
// 4. providers: [PostService, PostSubscriber, SanitizeService], 这个是为模块注册服务和订阅器
// 5. controllers: [PostController], 这个是为模块注册控制器

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity, CategoryEntity, CommentEntity]), // 为模块注册实体
      DatabaseModule.forRepository([PostRepository]),
  ],
  controllers: [PostController],
  providers: [PostService, PostSubscriber, SanitizeService],
  exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {}