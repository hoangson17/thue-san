import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAllClient(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: string,
  ) {
    return this.ordersService.findAllClient(req.user.id, page, limit, order);
  }

  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(@Req() req, @Body() body: any) {
    const userId = req.user.id;
    return this.ordersService.checkout(userId, body.payment_method);
  }

  @Post('buy-now')
  @UseGuards(AuthGuard)
  buyNow(@Req() req, @Body() body) {
    return this.ordersService.buyNow(req.user.id, body);
  }
}
