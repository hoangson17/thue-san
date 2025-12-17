import { Test, TestingModule } from '@nestjs/testing';
import { ToumamentController } from './toumament.controller';
import { ToumamentService } from './toumament.service';

describe('ToumamentController', () => {
  let controller: ToumamentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToumamentController],
      providers: [ToumamentService],
    }).compile();

    controller = module.get<ToumamentController>(ToumamentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
