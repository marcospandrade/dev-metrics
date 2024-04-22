import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { take, tap } from 'rxjs';

import { ValidateSchema } from '@core/decorators/validate-schema';
import { LoggerService } from '@core/logger/logger.service';
import { QueueService } from '@modules/queue/queue.service';

import { QueuePublishEventCommand } from '../queue-publish-event.command';

@CommandHandler(QueuePublishEventCommand)
export class QueuePublishEventHandler implements ICommandHandler<QueuePublishEventCommand> {
    constructor(
        private queueService: QueueService,
        private logger: LoggerService,
    ) {}

    @ValidateSchema(QueuePublishEventCommand)
    async execute(command: QueuePublishEventCommand) {
        const { eventStacksName, entityId, eventKey } = command;
        this.logger.info(command, 'QUEUE PUBLISH COMMAND');

        this.logger.info(`Publishing message to queue for ${entityId}`);

        return this.queueService.publish(`${eventKey}.${eventStacksName}.${entityId}`, command).pipe(
            take(1),

            tap(() => {
                this.logger.info(`Published message to queue for ${entityId}`);
            }),
        );
    }
}
