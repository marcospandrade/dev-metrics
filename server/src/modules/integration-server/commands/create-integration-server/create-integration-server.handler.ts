import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIntegrationServerCommand } from './create-integration-server.command';
import { IntegrationServerUseCases } from '../../use-cases/integration-server.use-cases.service';
import { CreateIntegrationServerDto } from '../../dto/create-integration-server.dto';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';

@CommandHandler(CreateIntegrationServerCommand)
export class CreateIntegrationServerCommandHandler implements ICommandHandler<CreateIntegrationServerCommand> {
    public constructor(
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly logger: LoggerService,
    ) {}

    async execute(command: CreateIntegrationServerCommand): Promise<void> {
        this.logger.info('Executing CreateIntegrationProjectCommand');
        this.integrationServerUseCases.create(
            SchemaValidator.toInstance(this.mountProjectDto(command), CreateIntegrationServerDto),
        );
    }

    private mountProjectDto(payload: CreateIntegrationServerCommand): CreateIntegrationServerDto {
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
