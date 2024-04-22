import { TestBed } from '@automock/jest';
import { CommandBus } from '@nestjs/cqrs';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
    let controller: OrderController;

    beforeAll(async () => {
        controller = TestBed.create(OrderController)
            .mock(OrderService)
            .using({})
            .mock(CommandBus)
            .using({})
            .compile().unit;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
