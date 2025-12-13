import { Test, TestingModule } from '@nestjs/testing';
import { CaroselsController } from './carosels.controller';
import { CaroselsService } from './carosels.service';

describe('CaroselsController', () => {
  let controller: CaroselsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaroselsController],
      providers: [CaroselsService],
    }).compile();

    controller = module.get<CaroselsController>(CaroselsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
