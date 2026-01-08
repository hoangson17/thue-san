import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('/all')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('order') order?: string,
  ) {
    const safeOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';
    return this.usersService.getAllUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      role,
      order: safeOrder,
    });
  }
}
