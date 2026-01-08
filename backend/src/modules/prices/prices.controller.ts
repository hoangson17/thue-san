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
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ) {
    return this.pricesService.findAll({ page, limit, order, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricesService.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.pricesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.pricesService.update(+id, data);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.pricesService.restore(+id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pricesService.softDelete(+id);
  }

  @Delete(':id/softdelete')
  softDelete(@Param('id') id: string) {
    return this.pricesService.softDelete(+id);
  }
}
