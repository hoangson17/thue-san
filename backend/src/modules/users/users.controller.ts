import { Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
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

  @Get('/locked')
  @UseGuards(AuthGuard)
  findUserLocked(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('order') order?: string,
  ) {
    const safeOrder = order === 'ASC' || order === 'DESC' ? order : 'DESC';
    return this.usersService.findUserLocked({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      role,
      order: safeOrder,
    });
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

  @Patch('/restore/:id')
  restore(@Param('id') id: string) {
    return this.usersService.restore(+id);
  }
  
  @Delete('/lock/:id')
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }

}
