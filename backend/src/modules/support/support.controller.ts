import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  async getSupport(@Query('page') page?: number, @Query('limit') limit?: number, @Query('order') order?: string) {
    return await this.supportService.getSupport({page, limit, order});
  }

  @Get(':id')
  async getSupportById(@Param('id') id: number) {
    return await this.supportService.getSupportById(id);
  }

  @Post()
  async createSupport(@Body() body: any) {
    return await this.supportService.createSupport(body);
  }

  @Patch(':id')
  async updateSupport(@Param('id') id: number, @Body() body: any) {
    return await this.supportService.updateSupport(id, body);
  }

  @Delete(':id')
  async deleteSupport(@Param('id') id: number) {
    return await this.supportService.deleteSupport(id);
  }
}
