import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  async getSupport() {
    return await this.supportService.getSupport();
  }

  @Get(':id')
  async getSupportById(id: number) {
    return await this.supportService.getSupportById(id);
  }

  @Post()
  async createSupport(@Body() body: any) {
    return await this.supportService.createSupport(body);
  }
}
