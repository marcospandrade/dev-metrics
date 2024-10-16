import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { IntegrationServerUseCases } from './use-cases/integration-server.use-cases.service';
import { IntegrationServer } from './entities/integration-server.entity';
import { IntegrationServerSaga } from './sagas/integration-server.saga';
import { IntegrationServerController } from './integration-server.controller';
import { AtlassianModule } from '@lib/atlassian/atlassian.module';
import { CheckSyncIntegrationProjectCommandHandler } from './commands/check-sync-integration-project/check-sync-integration-project.handler';
import { UpsertIntegrationServerCommandHandler } from './commands/upsert-integration-server/upsert-integration-server.handler';
import { SyncIntegrationProjectCommandHandler } from './commands/sync-integration-project/sync-integration-project.handler';
import { GetProjectSyncStatusQueryHandler } from './queries/get-project-sync-status/get-project-sync-status.handler';
import { ProjectSaga } from './sagas/project.saga';
import { ProjectUseCases } from './use-cases/projects.use-cases.service';
import { Project } from './entities/project.entity';
import { UpsertProjectsCommandHandler } from './commands/upsert-projects/upsert-projects.handler';
import { CustomFieldsUseCases } from './use-cases/custom-fields.use-cases.service';
import { SearchCustomFieldQueryHandler } from './queries/search-custom-field/search-custom-field.handler';
import { RegisterCustomFieldsHandler } from './commands/register-custom-fields/register-custom-fields.handler';
import { CustomFields } from './entities/custom-fields.entity';
import { ProjectsController } from './projects.controller';
import { GetAllIssuesFieldsQueryHandler } from './queries/get-all-issues-fields/get-all-issues-fields.handler';

const CommandHandlers = [
    UpsertIntegrationServerCommandHandler,
    CheckSyncIntegrationProjectCommandHandler,
    SyncIntegrationProjectCommandHandler,
    UpsertProjectsCommandHandler,
    RegisterCustomFieldsHandler,
];

const QueryHandlers = [GetProjectSyncStatusQueryHandler, SearchCustomFieldQueryHandler, GetAllIssuesFieldsQueryHandler];

const Sagas = [IntegrationServerSaga, ProjectSaga];

const UseCases = [IntegrationServerUseCases, ProjectUseCases, CustomFieldsUseCases];

@Module({
    controllers: [IntegrationServerController, ProjectsController],
    imports: [TypeOrmModule.forFeature([IntegrationServer, Project, CustomFields]), CqrsModule, AtlassianModule],
    providers: [...UseCases, ...Sagas, ...CommandHandlers, ...QueryHandlers],
})
export class IntegrationProjectModule { }
