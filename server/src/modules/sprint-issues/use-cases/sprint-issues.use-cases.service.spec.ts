import { Test, TestingModule } from '@nestjs/testing';
import { SprintIssuesUseCasesService } from './sprint-issues.use-cases.service';

describe('SprintIssuesUseCasesService', () => {
    let service: SprintIssuesUseCasesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SprintIssuesUseCasesService],
        }).compile();

        service = module.get<SprintIssuesUseCasesService>(SprintIssuesUseCasesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
