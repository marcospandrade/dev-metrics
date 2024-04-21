import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';

import { LoggerService } from '@core/logger/logger.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidateSchema } from '@core/decorators/validate-schema';
// import { QUEUE_REQUEST_TOPIC } from '@modules/queue/constants/event-handler-topics';
import { ORDER_REQUEST_EVENTS } from '../constants/event-names';
// import { QueueRequestOptions } from '@modules/queue/types/queue-request-options';
import { OrderService } from '@modules/order/order.service';

// import { UpdatedOrderEvent } from '@modules/order/events/updated-order.event';
import { SchemaValidator } from '@core/utils';
// import { Order } from '@modules/order/entities/order.entity';
// import { EventStacks } from '@modules/event-stacks/entities/event-stacks.entity';
// import { EventStacksCreateCommand } from '@modules/event-stacks/commands/event-stacks-create.command';

import { CreateEventStackEvent } from '@modules/event-stacks/events/create-event-stack.event';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
        private readonly orderService: OrderService,
        private readonly logger: LoggerService,
    ) {}

    @ValidateSchema(CreateOrderCommand)
    async execute(command: CreateOrderCommand) {
        this.logger.info(command, `CreateOrderCommandHandler: ${command.name}`);

        const newOrder = await this.orderService.createOrder(command);

        this.logger.info({ newOrder }, 'Order created successfully');

        this.eventBus.publish(
            SchemaValidator.toInstance(
                {
                    metadata: JSON.stringify(newOrder),
                    eventKey: newOrder.vendor.key,
                    eventName: ORDER_REQUEST_EVENTS.CREATE_ORDER_EVENT,
                    entityId: newOrder.id,
                },
                CreateEventStackEvent,
            ),
        );

        return newOrder;
    }

    // private createEventStack(order: Order, eventKey: string) {
    //     return this.commandBus.execute(
    //         SchemaValidator.toInstance(
    //             {
    //                 metadata: JSON.stringify(order),
    //                 eventName: `${ORDER_REQUEST_EVENTS.CREATE_ORDER_EVENT}:${eventKey}`,
    //                 entityId: order.id,
    //             },
    //             EventStacksCreateCommand,
    //         ),
    //     );
    // }

    // private emitQueueRequest(order: Order, eventStack: EventStacks) {
    //     return this.eventEmitter
    //         .emitAsync(QUEUE_REQUEST_TOPIC, {
    //             queueName: `${ORDER_REQUEST_EVENTS.CREATE_ORDER_EVENT}:${order.vendor.key}`,
    //             data: { payload: order },
    //         } as QueueRequestOptions)
    //         .then((r) => {
    //             this.logger.info(r, `Received third party vendor response for vendor ${order.vendorId}`);

    //             return r[0];
    //         })
    //         .then((r) =>
    //             this.eventBus.publish(
    //                 SchemaValidator.toInstance({ ...r, eventStackId: eventStack.id }, UpdatedOrderEvent),
    //             ),
    //         );
    // }
}
