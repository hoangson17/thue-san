import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CourtService } from './court.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number,@Query('order') order?: string, @Query('search') search?: string) {
    return this.courtService.findAll({ page, limit, order, search });
  }


  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.courtService.findOne(id);
  }

  @Get('/courtType')
  findAllCourtType() {
    return this.courtService.findAllCourtType();
  }

  @Get('/courtType/:id')
  findAllByCourtType(@Param('id') id: number) {
    return this.courtService.findAllByCourtType(id);
  }

  @Get('/sport/:id')
  findAllCourtTypeBySport(@Param('id') id: number) {
    return this.courtService.findAllCourtTypeBySport(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 6))
  create(@Body() data: any, @UploadedFiles() files: Express.Multer.File) {
    return this.courtService.create(data, files as any);
  }

  @Post('/courtType')
  createCourtType(@Body() data: any) {
    return this.courtService.createCourtType(data);
  }

  @Delete('/softDelete/:id')
  softDelete(@Param() id: number) {
    return this.courtService.softDelete(id);
  }

  @Post('/softDeleteCourtType/:id')
  softDeleteCourtType(@Param() id: number) {
    return this.courtService.softDeleteCourtType(id);
  }

  @Post('/restore/:id')
  restore(@Param() id: number) {
    return this.courtService.restore(id);
  }

  @Patch('/restoreCourtType/:id')
  restoreCourtType(@Param() id: number) {
    return this.courtService.restoreCourtType(id);
  }

  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('files', 6))
  update(
    @Param() id: number,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.courtService.update(id, data, files);
  }

  @Patch('/updateCourtType/:id')
  updateCourtType(@Param() id: number, @Body() data: any) {
    return this.courtService.updateCourtType(id, data);
  }

  @Delete('/:id')
  delete(@Param() id: number) {
    return this.courtService.delete(id);
  }

  @Delete('/deleteCourtType/:id')
  deleteCourtType(@Param() id: number) {
    return this.courtService.deleteCourtType(id);
  }
}
