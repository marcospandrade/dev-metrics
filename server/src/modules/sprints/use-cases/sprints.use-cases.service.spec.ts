import { Test, TestingModule } from '@nestjs/testing';
import { SprintsUseCasesService } from './sprints.use-cases.service';

describe('SprintsUseCasesService', () => {
  let service: SprintsUseCasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SprintsUseCasesService],
    }).compile();

    service = module.get<SprintsUseCasesService>(SprintsUseCasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
