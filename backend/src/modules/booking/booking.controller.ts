import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  findAllByUser(@Req() req) {
    return this.bookingService.findAllByUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/admin')
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ) {
    return this.bookingService.findAllAdmin(
      Number(page) || 1,
      Number(limit) || 8,
      order,
      search,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.bookingService.create(req.user.id, body);
  }
}
