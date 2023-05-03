import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto, QueryCategoryDto, QueryCategoryTreeDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoryService } from '../services/category.service';
import { Delete } from '@nestjs/common';
import { DeleteWithTrashDto, RestoreDto } from '@/modules/restful/dtos/delete.dto';

@Controller('categories')
export class CategoryController {
  // 写一个 CategoryController
  // 1. 获取所有分类
  // 2. 获取单个分类
  // 3. 创建分类
  // 4. 更新分类
  // 5. 删除分类
  constructor(public service: CategoryService) {}

  // 获取分页的分类
  @Get()
  async list(
    @Query()
    options: QueryCategoryDto,
  ) {
    return this.service.paginate(options);
  }

  // 获取树形结构的分类
  @Get('trees')
  async findTrees() {
    return this.service.findTrees();
  }

  // 1. @Param('id', new ParseUUIDPipe())，这个是为参数添加验证器
  // 2. id: string，这个是为参数添加类型
  @Get(':id')
  async detail(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ) {
    return this.service.detail(id);
  }

  // 创建分类
  @Post()
  async store(
    @Body()
    data: CreateCategoryDto,
  ) {
    return this.service.create(data);
  }

  @Patch()
  // @SerializeOptions({ groups: ['category-detail'] })
  async update(
      @Body()
      data: UpdateCategoryDto,
  ) {
      return this.service.update(data);
  }


  @Get('tree')
  @SerializeOptions({ groups: ['category-tree'] })
  async tree(@Query() options: QueryCategoryTreeDto) {
      return this.service.findTrees(options);
  }

  @Delete()
  @SerializeOptions({ groups: ['category-list'] })
  async delete(
      @Body()
      data: DeleteWithTrashDto,
  ) {
      const { ids, trash } = data;
      return this.service.delete(ids, trash);
  }

  // @Patch('restore')
  // @SerializeOptions({ groups: ['category-list'] })
  // async restore(
  //     @Body()
  //     data: RestoreDto,
  // ) {
  //     const { ids } = data;
  //     return this.service.restore(ids);
  // }
}
