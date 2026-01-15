import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    return this.categoriesService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      order: order || 'ASC',
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.categoriesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.categoriesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.delete(+id);
  }
}
