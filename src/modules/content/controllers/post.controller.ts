import { PaginateOptions } from "@/modules/database/types";
import { Controller, Get, Query, Param, ParseUUIDPipe, Post, Body, Patch, Delete, ValidationPipe } from "@nestjs/common";
import { CreatePostDto, QueryPostDto, UpdatePostDto } from "../dtos/post.dto";
import { PostService } from "../services/post.services";

// src/modules/content/controllers/post.controller.ts	
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    async list(
        @Query(
            // 对请求数据进行验证
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        ) options : QueryPostDto,
    ) { 
      return this.service.paginate(options);
    }

    @Get(':id')
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }
    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true, // 如果设置成true则代码在验证之后对数据进行序列化
                forbidUnknownValues: true, // 代表如果请求数据中有多余的数据(比如没有在验证管道中定义的属性)则会报出403错误
                validationError: { target: false }, // 代表不会在响应数据中使我们的验证类也暴露出来
                groups: ['create'], // 用于设置验证组
            }),
        )
        data: CreatePostDto,
    ) {
        return this.service.create(data);
    }

    @Patch()
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdatePostDto,
    ) {
        return this.service.update(data);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.delete(id);
    }
}