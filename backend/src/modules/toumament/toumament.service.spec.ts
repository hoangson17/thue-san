import { Test, TestingModule } from '@nestjs/testing';
import { ToumamentService } from './toumament.service';

describe('ToumamentService', () => {
  let service: ToumamentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToumamentService],
    }).compile();

    service = module.get<ToumamentService>(ToumamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
