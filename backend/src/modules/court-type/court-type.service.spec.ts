import { Test, TestingModule } from '@nestjs/testing';
import { CourtTypeService } from './court-type.service';

describe('CourtTypeService', () => {
  let service: CourtTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtTypeService],
    }).compile();

    service = module.get<CourtTypeService>(CourtTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
