import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateIntegrationServerCommand } from './create-integration-server.command';
import { IntegrationServerUseCases } from '../../use-cases/integration-server.use-cases.service';
import { CreateIntegrationServerDto } from '../../dto/create-integration-server.dto';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';
import { IntegrationServer } from '@modules/integration-server/entities/integration-server.entity';
import { CheckHasOnlyOneProjectEvent } from '@modules/integration-server/events/check-has-only-one-project.event';
import { ValidateSchema } from '@core/decorators/validate-schema';

@CommandHandler(CreateIntegrationServerCommand)
export class CreateIntegrationServerCommandHandler implements ICommandHandler<CreateIntegrationServerCommand> {
    public constructor(
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly logger: LoggerService,
        private readonly eventBus: EventBus,
    ) {}

    @ValidateSchema(CreateIntegrationServerCommand)
    async execute(command: CreateIntegrationServerCommand): Promise<IntegrationServer> {
        this.logger.info('Executing CreateIntegrationServerCommand');

        const server = await this.integrationServerUseCases.create(this.mountCreateServerDto(command));

        this.logger.info({ server }, 'Integration server created successfully');

        this.eventBus.publish(
            SchemaValidator.toInstance(
                { cloudId: server.jiraId, userEmail: server.user.email },
                CheckHasOnlyOneProjectEvent,
            ),
        );

        return server;
    }

    private mountCreateServerDto(payload: CreateIntegrationServerCommand): CreateIntegrationServerDto {
        return SchemaValidator.toInstance(
            {
                name: payload.name,
                url: payload.url,
                jiraId: payload.id,
                scopes: JSON.stringify(payload.scopes),
                userId: payload.userId,
            },
            CreateIntegrationServerDto,
        );
    }
}
