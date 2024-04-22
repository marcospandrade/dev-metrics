import { TestBed } from '@automock/jest';

import { AtlassianFactoryService } from './atlassian-factory.service';

describe('AtlassianService', () => {
    let service: AtlassianFactoryService;

    beforeEach(async () => {
        service = TestBed.create(AtlassianFactoryService).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
