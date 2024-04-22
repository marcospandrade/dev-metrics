import { TestBed } from '@automock/jest';

import { OrderService } from './order.service';

describe('OrderService', () => {
    let service: OrderService;

    beforeAll(() => {
        service = TestBed.create(OrderService).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
