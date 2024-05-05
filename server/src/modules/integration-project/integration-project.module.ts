import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { IntegrationProjectUseCases } from './use-cases/integration-project.use-cases.service';
import { IntegrationProject } from './entities/integration-project.entity';
import { IntegrationProjectSaga } from './sagas/integration-project.saga';
import { IntegrationProjectController } from './integration-project.controller';
import { AtlassianModule } from '@lib/atlassian/atlassian.module';
import { CheckSyncIntegrationProjectCommandHandler } from './commands/check-sync-integration-project/check-sync-integration-project.handler';
import { CreateIntegrationProjectCommandHandler } from './commands/create-integration-project/create-integration-project.handler';
import { SyncIntegrationProjectCommandHandler } from './commands/sync-integration-project/sync-integration-project.handler';

const CommandHandlers = [
    CreateIntegrationProjectCommandHandler,
    CheckSyncIntegrationProjectCommandHandler,
    SyncIntegrationProjectCommandHandler,
];

@Module({
    controllers: [IntegrationProjectController],
    imports: [TypeOrmModule.forFeature([IntegrationProject]), CqrsModule, AtlassianModule],
    providers: [IntegrationProjectUseCases, ...CommandHandlers, IntegrationProjectSaga],
})
export class IntegrationProjectModule {}
