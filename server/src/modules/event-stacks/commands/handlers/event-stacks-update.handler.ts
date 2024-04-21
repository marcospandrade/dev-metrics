import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EventStacksService } from '@modules/event-stacks/event-stacks.service';
import { LoggerService } from '@core/logger/logger.service';
import { ValidateSchema } from '@core/decorators/validate-schema';

import { EventStacksUpdateCommand } from '../event-stacks-update.command';
import { EventStacksUpdatedEvent } from '@modules/event-stacks/events/event-stacks-updated.event';
import { SchemaValidator } from '@core/utils';

@CommandHandler(EventStacksUpdateCommand)
export class EventStacksUpdateHandler implements ICommandHandler<EventStacksUpdateCommand> {
    constructor(
        private service: EventStacksService,
        private eventBus: EventBus,
        private logger: LoggerService,
    ) {}

    @ValidateSchema(EventStacksUpdateCommand)
    async execute(command: EventStacksUpdateCommand) {
        this.logger.info(`EventStacksUpdateHandler: Updating event stack ${command.id}`);

        if ('status' in command) {
            this.logger.info(
                `EventStacksUpdateHandler: Updating event stack ${command.id} with status ${command.status}`,
            );
        }

        const eventStacks = await this.service.update(command);

        this.eventBus.publish(SchemaValidator.toInstance(eventStacks, EventStacksUpdatedEvent));

        return eventStacks;
    }
}
