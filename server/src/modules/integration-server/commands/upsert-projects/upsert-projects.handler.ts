import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpsertProjectsCommand } from './upsert-projects.command';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import { CheckSyncProjectEvent } from '@modules/integration-server/events/check-sync-project.event';
import { ProjectUseCases } from '@modules/integration-server/use-cases/projects.use-cases.service';
import { CreateProjectDto } from '@modules/integration-server/dto/create-project.dto';
import { AtlassianProject } from '@lib/atlassian/types/atlassian-project.type';

@CommandHandler(UpsertProjectsCommand)
export class UpsertProjectsCommandHandler implements ICommandHandler<UpsertProjectsCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly eventBus: EventBus,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly projectUseCases: ProjectUseCases,
    ) {}
    public async execute(command: UpsertProjectsCommand): Promise<any> {
        this.logger.info({ integrationServerId: command.serverInternalId }, 'Upserting projects for server: ');

        const { total, values: projects } = await this.integrationServerUseCases.getServerProjects(
            command.serverExternalId,
            command.userEmail,
        );

        const upsertProjects = await this.projectUseCases.upsertMany(
            this.mountCreateProjectDto(command.serverInternalId, projects),
        );

        if (total === 1) {
            this.eventBus.publish(
                SchemaValidator.toInstance(
                    { projectId: upsertProjects[0].id, userEmail: command.userEmail },
                    CheckSyncProjectEvent,
                ),
            );
        }

        // TODO: retornar a lista de projetos inseridos para o usuario
        return projects;
    }

    private mountCreateProjectDto(integrationServerId: string, projects: AtlassianProject[]): CreateProjectDto[] {
        return projects.map(project => ({
            isPrivate: project.isPrivate,
            key: project.key,
            name: project.name,
            projectTypeKey: project.projectTypeKey,
            integrationUUID: project.uuid,
            atlassianId: project.id,
            integrationServerId: integrationServerId,
            isSynced: false,
        }));
    }
}
