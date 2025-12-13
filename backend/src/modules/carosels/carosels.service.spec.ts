import { Test, TestingModule } from '@nestjs/testing';
import { CaroselsService } from './carosels.service';

describe('CaroselsService', () => {
  let service: CaroselsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaroselsService],
    }).compile();

    service = module.get<CaroselsService>(CaroselsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
