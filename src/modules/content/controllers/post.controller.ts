import { AppIntercepter } from "@/modules/core/providers/app.intercepter";
import { Controller, Get, Query, Param, ParseUUIDPipe, Post, Body, Patch, Delete, ValidationPipe, UseInterceptors, SerializeOptions } from "@nestjs/common";
import { CreatePostDto, QueryPostDto, UpdatePostDto } from "../dtos/post.dto";
import { PostService } from "../services/post.services";

// src/modules/content/controllers/post.controller.ts	
@UseInterceptors(AppIntercepter)
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] }) // 配置序列化组
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
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }
    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
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
    @SerializeOptions({ groups: ['post-detail'] })
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
    @SerializeOptions({ groups: ['post-detail'] })
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.delete(id);
    }
}