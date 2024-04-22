import { TestBed } from '@automock/jest';

import { EventController } from './event.controller';

describe('EventController', () => {
    let controller: EventController;

    beforeAll(() => {
        controller = TestBed.create(EventController).compile().unit;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
