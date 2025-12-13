import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourtService } from './court.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get()
  findAll() {
    return this.courtService.findAll();
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
  create(@Body() data: any) {
    return this.courtService.create(data);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('/courtType')
  createCourtType(@Body() data: any) {
    return this.courtService.createCourtType(data);
  }

  @Post('/softDelete/:id')
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

  @Post('/restoreCourtType/:id')
  restoreCourtType(@Param() id: number) {
    return this.courtService.restoreCourtType(id);
  }

  @Patch('/update/:id')
  update(@Param() id: number, @Body() data: any) {
    return this.courtService.update(id, data);
  }

  @Patch('/updateCourtType/:id')
  updateCourtType(@Param() id: number, @Body() data: any) {
    return this.courtService.updateCourtType(id, data);
  }

  @Delete('/delete/:id')
  delete(@Param() id: number) {
    return this.courtService.delete(id);
  }

  @Delete('/deleteCourtType/:id')
  deleteCourtType(@Param() id: number) {
    return this.courtService.deleteCourtType(id);
  }


}
