import { TestBed } from '@automock/jest';

import { EventService } from './event.service';

describe('EventService', () => {
    let service: EventService;

    beforeAll(() => {
        service = TestBed.create(EventService).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
