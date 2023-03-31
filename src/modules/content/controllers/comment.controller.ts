import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto, QueryCommentDto } from '../dtos/comment.dto';
import { CommentService } from '../services/comment.service';
import { Delete } from '@nestjs/common';

@Controller('categories')
export class CommentController {

  constructor(public service: CommentService) {}

  // 获取分页的评论
  @Get()
  async list(
    @Query(
      // 对请求数据进行验证
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    )
    options: QueryCommentDto,
  ) {
    return this.service.paginate(options);
  }

  // 获取树形结构的评论
  @Get('trees')
  async findTrees() {
    return this.service.findTrees();
  }


  // 创建评论
  @Post()
  async store(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    )
    data: CreateCommentDto,
  ) {
    return this.service.create(data);
  }


  @Delete()
  async delete(
    @Body('id', new ParseUUIDPipe())
    id: string,
  ) {
    return this.service.delete(id);
  }
}
