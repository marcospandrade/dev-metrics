import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationProjectUseCases } from './integration-project.use-cases.service';

describe('IntegrationProjectService', () => {
    let service: IntegrationProjectUseCases;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IntegrationProjectUseCases],
        }).compile();

        service = module.get<IntegrationProjectUseCases>(IntegrationProjectUseCases);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
