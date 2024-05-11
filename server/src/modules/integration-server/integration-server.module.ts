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

const CommandHandlers = [
    UpsertIntegrationServerCommandHandler,
    CheckSyncIntegrationProjectCommandHandler,
    SyncIntegrationProjectCommandHandler,
];

const QueryHandlers = [GetProjectSyncStatusQueryHandler];

const Sagas = [IntegrationServerSaga, ProjectSaga];

@Module({
    controllers: [IntegrationServerController],
    imports: [TypeOrmModule.forFeature([IntegrationServer]), CqrsModule, AtlassianModule],
    providers: [IntegrationServerUseCases, ...Sagas, ...CommandHandlers, ...QueryHandlers],
})
export class IntegrationProjectModule {}
