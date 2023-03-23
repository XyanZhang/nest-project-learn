import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../database/database.module";
import { PostController } from "./controllers/post.controller";
import { PostEntity } from "./entities/post.entity";
import { PostRepository } from "./repositories/post.repository";
import { PostService } from "./services/post.services";
import { PostSubscriber } from "./subscribers/post.subscriber";

// src/modules/content/content.module.ts
@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity]),
      DatabaseModule.forRepository([PostRepository]),
  ],
  controllers: [PostController],
  providers: [PostService, PostSubscriber],
  exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {}