import { Body, Controller, Post } from '@nestjs/common';

// import { QueryDto } from '@core/models/query';

import { OrderService } from './order.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/create-order/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { SchemaValidator } from '@core/utils';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    createOrderEvent(@Body() payload: CreateOrderDto) {
        return this.commandBus.execute(SchemaValidator.toInstance(payload, CreateOrderCommand));
    }

    // @Get()
    // readOrders(@Query() query: QueryDto) {
    //     return this.orderService.readOrders(query);
    // }
}
