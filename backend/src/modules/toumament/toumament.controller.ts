import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ToumamentService } from './toumament.service';
import { FilesInterceptor } from '@nestjs/platform-express';

export type QueryParams = {
  select: string;
  order: string;
  sort: string;
  page: number;
  limit: number;
  status: string;
  name: string;
  email: string;
  include: string;
};

@Controller('tournaments')
export class ToumamentController {
  constructor(private readonly toumamentService: ToumamentService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
      return this.toumamentService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(id: number) {
    return this.toumamentService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(@Body() data: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.toumamentService.create(data,files);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(@Param('id') id: number, @Body() data: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.toumamentService.update(id, data ,files);
  }

  @Patch(':id/restore')
  restore(id: number) {
    return this.toumamentService.restore(id);
  }

  @Delete(':id')
  softDelete(id: number) {
    return this.toumamentService.softDelete(id);
  }

  @Delete(':id/delete')
  delete(id: number) {
    return this.toumamentService.delete(id);
  }

  

}
