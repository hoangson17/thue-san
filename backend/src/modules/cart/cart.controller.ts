import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    console.log(req.user);
    return this.cartService.findAll(req.user.id);
  }
}
