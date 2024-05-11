import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationServerUseCases } from './integration-server.use-cases.service';

describe('IntegrationProjectService', () => {
    let service: IntegrationServerUseCases;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IntegrationServerUseCases],
        }).compile();

        service = module.get<IntegrationServerUseCases>(IntegrationServerUseCases);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
