import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OrderService } from '@modules/order/order.service';
import { LoggerService } from '@core/logger/logger.service';
import { UpdateOrderCommand } from './update-order-status.command';
import { OrderStatus } from '@modules/order/entities/order.entity';
import { EventService } from '@modules/event/event.service';
import { EventType } from '@modules/event/event.model';
import { SchemaValidator } from '@core/utils';
import { UpdateEventStackEvent } from '@modules/event-stacks/events/update-event-stack.event';
import { EventStacksStatusEnum } from '@modules/event-stacks/entities/event-stacks.entity';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderCommandHandler implements ICommandHandler<UpdateOrderCommand> {
    constructor(
        private readonly service: OrderService,
        private readonly eventService: EventService,
        private readonly logger: LoggerService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: UpdateOrderCommand) {
        this.logger.info(command, 'UpdatedOrderCommandHandler: Updating order');

        const updatedOrder = await this.service.updateOrder(command.data.entityId, {
            purchaseOrderId: command.purchaseOrderId,
            status: OrderStatus.FINISHED,
        });

        this.logger.info(updatedOrder, 'Updated order');

        this.eventBus.publish(
            SchemaValidator.toInstance(
                {
                    id: command.data.eventStackId,
                    status: this.mapOrderStatusToEventStackStatus(updatedOrder.status),
                    metadata: JSON.stringify(updatedOrder),
                },
                UpdateEventStackEvent,
                {
                    exposeUnsetFields: false,
                },
            ),
        );

        this.eventService.publish('server.events', { data: updatedOrder, type: EventType.UPDATED_ORDER });
    }

    private mapOrderStatusToEventStackStatus(status: OrderStatus) {
        switch (status) {
            case OrderStatus.STARTED:
                return EventStacksStatusEnum.PROCESSING;

            case OrderStatus.IN_PROGRESS:
                return EventStacksStatusEnum.PROCESSING;

            case OrderStatus.FINISHED:
                return EventStacksStatusEnum.COMPLETED;

            default:
                return EventStacksStatusEnum.PENDING;
        }
    }
}
