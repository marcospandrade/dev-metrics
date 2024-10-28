import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';
import { ValidateSchema } from '@core/decorators/validate-schema';
import { IntegrationServerUseCases } from '../../use-cases/integration-server.use-cases.service';
import { UpsertIntegrationServerDto } from '../../dto/create-integration-server.dto';
import { UpsertIntegrationServerCommand } from './upsert-integration-server.command';
import { ConfigService } from '@nestjs/config';
import { UpsertRawProjectsEvent } from '@modules/integration-server/events/upsert-raw-projects.event';

@CommandHandler(UpsertIntegrationServerCommand)
export class UpsertIntegrationServerCommandHandler implements ICommandHandler<UpsertIntegrationServerCommand> {
    public constructor(
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
        private readonly eventBus: EventBus,
    ) {}

    @ValidateSchema(UpsertIntegrationServerCommand)
    public async execute(command: UpsertIntegrationServerCommand) {
        this.logger.info('Executing UpsertIntegrationServerCommand');

        const server = await this.integrationServerUseCases.upsert(this.mountCreateServerDto(command));

        this.logger.info({ server }, 'Integration server created successfully');

        this.eventBus.publish(
            SchemaValidator.toInstance(
                {
                    serverExternalId: server.jiraId,
                    serverInternalId: server.id,
                    userEmail: server.user.email,
                },
                UpsertRawProjectsEvent,
            ),
        );
    }

    private mountCreateServerDto(payload: UpsertIntegrationServerCommand): UpsertIntegrationServerDto {
        return SchemaValidator.toInstance(
            {
                name: payload.name,
                url: payload.url,
                jiraId: payload.id,
                scopes: JSON.stringify(payload.scopes),
                userId: payload.userId,
            },
            UpsertIntegrationServerDto,
        );
    }
}
