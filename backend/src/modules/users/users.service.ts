import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

findAll({ page, limit }: { page?: number; limit?: number }) {
  if (!page || !limit) {
    return this.userRepository.findAndCount();
  }

  return this.userRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
}

}
