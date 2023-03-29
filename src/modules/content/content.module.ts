import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../database/database.module";
import { PostController } from "./controllers/post.controller";
import { PostEntity } from "./entities/post.entity";
import { PostRepository } from "./repositories/post.repository";
import { SanitizeService } from "./repositories/services/sanitize.service";
import { PostService } from "./services/post.services";
import { PostSubscriber } from "./subscribers/post.subscriber";
import { CategoryEntity } from './entities/category.entity';
import { CommentEntity } from './entities/comment.entity';

// src/modules/content/content.module.ts
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