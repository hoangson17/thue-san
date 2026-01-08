import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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

  @Post()
  @UseGuards(AuthGuard)
  addToCart(@Req() req: any, @Body() body: any) {
    return this.cartService.addToCart(
      req.user.id,
      body.productId,
      body.quantity,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeFromCart(@Req() req: any,@Param('id') id: number) {
    return this.cartService.removeFromCart(req.user.id, id);
  }
}
