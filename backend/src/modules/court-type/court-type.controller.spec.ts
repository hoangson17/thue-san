import { Test, TestingModule } from '@nestjs/testing';
import { CourtTypeController } from './court-type.controller';
import { CourtTypeService } from './court-type.service';

describe('CourtTypeController', () => {
  let controller: CourtTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtTypeController],
      providers: [CourtTypeService],
    }).compile();

    controller = module.get<CourtTypeController>(CourtTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
