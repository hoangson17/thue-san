import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourtTypeService } from './court-type.service';

@Controller('court-type')
export class CourtTypeController {
  constructor(private readonly courtTypeService: CourtTypeService) {}

  @Get()
  getAll() {
    return this.courtTypeService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.courtTypeService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.courtTypeService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.courtTypeService.delete(id);
  }
}
