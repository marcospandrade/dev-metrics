import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIntegrationProjectCommand } from './create-integration-project.command';
import { IntegrationProjectUseCases } from '../../use-cases/integration-project.use-cases.service';
import { CreateIntegrationProjectDto } from '../../dto/create-integration-project.dto';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';

@CommandHandler(CreateIntegrationProjectCommand)
export class CreateIntegrationProjectCommandHandler implements ICommandHandler<CreateIntegrationProjectCommand> {
    public constructor(
        private readonly integrationProjectUseCases: IntegrationProjectUseCases,
        private readonly logger: LoggerService,
    ) {}

    async execute(command: CreateIntegrationProjectCommand): Promise<void> {
        this.logger.info('Executing CreateIntegrationProjectCommand');
        this.integrationProjectUseCases.create(
            SchemaValidator.toInstance(this.mountProjectDto(command), CreateIntegrationProjectDto),
        );
    }

    private mountProjectDto(payload: CreateIntegrationProjectCommand): CreateIntegrationProjectDto {
        return SchemaValidator.toInstance(
            {
                name: payload.name,
                url: payload.url,
                jiraId: payload.id,
                scopes: JSON.stringify(payload.scopes),
                userId: payload.userId,
            },
            CreateIntegrationProjectDto,
        );
    }
}
