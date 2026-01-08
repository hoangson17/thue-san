import { Test, TestingModule } from '@nestjs/testing';
import { ToumamentRegisterController } from './toumament-register.controller';

describe('ToumamentRegisterController', () => {
  let controller: ToumamentRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToumamentRegisterController],
    }).compile();

    controller = module.get<ToumamentRegisterController>(ToumamentRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
