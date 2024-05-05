import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { IntegrationProjectUseCases } from './use-cases/integration-server.use-cases.service';
import { IntegrationServer } from './entities/integration-server.entity';
import { IntegrationProjectSaga } from './sagas/integration-server.saga';
import { IntegrationProjectController } from './integration-server.controller';
import { AtlassianModule } from '@lib/atlassian/atlassian.module';
import { CheckSyncIntegrationProjectCommandHandler } from './commands/check-sync-integration-project/check-sync-integration-project.handler';
import { CreateIntegrationServerCommandHandler } from './commands/create-integration-server/create-integration-server.handler';
import { SyncIntegrationProjectCommandHandler } from './commands/sync-integration-project/sync-integration-project.handler';

const CommandHandlers = [
    CreateIntegrationServerCommandHandler,
    CheckSyncIntegrationProjectCommandHandler,
    SyncIntegrationProjectCommandHandler,
];

@Module({
    controllers: [IntegrationProjectController],
    imports: [TypeOrmModule.forFeature([IntegrationServer]), CqrsModule, AtlassianModule],
    providers: [IntegrationProjectUseCases, ...CommandHandlers, IntegrationProjectSaga],
})
export class IntegrationProjectModule {}
