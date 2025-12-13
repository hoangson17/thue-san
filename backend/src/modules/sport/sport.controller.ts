import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SportService } from './sport.service';

@Controller('sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  findAll() {
    return this.sportService.findAll();
  }

  @Get('softDeleteAll')
  softDeleteAll() {
    return this.sportService.softDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sportService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.sportService.create(data);
  }

  @Post('softDelete/:id')
  softDelete(@Param('id') id: number) {
    return this.sportService.softDelete(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.sportService.update(id, data);
  }

  @Post('restore/:id')
  restore(@Param('id') id: number) {
    return this.sportService.restore(id);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.sportService.delete(id);
  }
}
