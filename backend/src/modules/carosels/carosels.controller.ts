import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CaroselsService } from './carosels.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('carosels')
export class CaroselsController {
  constructor(private readonly caroselsService: CaroselsService) {}

  @Get()
  findAll() {
    return this.caroselsService.findAll();
  }

  @Get(':id')
  findOne(id: number) {
    return this.caroselsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
    return this.caroselsService.create(data, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.caroselsService.update(id, data, file);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.caroselsService.delete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number) {
    return this.caroselsService.restore(id);
  }

  @Delete(':id/soft-delete')
  softDelete(@Param('id') id: number) {
    return this.caroselsService.softDelete(id);
  }
}
