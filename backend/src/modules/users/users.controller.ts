import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Get()
findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  return this.usersService.findAll({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
}

}
