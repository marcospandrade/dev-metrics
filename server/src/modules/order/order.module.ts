import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { EventModule } from '@modules/event/event.module';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderCommandHandler } from './commands/create-order/create-order.command.handler';
import { UpdateOrderCommandHandler } from './commands/update-order/update-order.command.handler';
import { OrderSaga } from './saga/order.saga';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), EventModule, CqrsModule],
    controllers: [OrderController],
    providers: [OrderService, CreateOrderCommandHandler, UpdateOrderCommandHandler, OrderSaga],
})
export class OrderModule {}
