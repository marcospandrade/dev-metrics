import { Module } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';

import * as dotenv from 'dotenv';
import * as path from 'path';

import { BaseAppConfig, ConfigModule } from '@core/config/config.module';
import { LoggerModule } from '@core/logger/logger.module';
import { CoreModule } from '@core/core.module';
import { QueueModule } from './modules/queue/queue.module';
import { OrmConfig } from '@core/config/sources/database.config';
import { DatabaseModule } from '@core/database/database.module';
import { CqrsErrorHandlerModule } from '@core/cqrs-error-handler/cqrs-error-handler.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { IssuesModule } from './modules/issues/issues.module';
import { IntegrationProjectModule } from './modules/integration-server/integration-server.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { SprintIssuesModule } from './modules/sprint-issues/sprint-issues.module';

dotenv.config({
    debug: true,
    encoding: 'utf8',
    path: path.resolve(process.cwd(), '.env'),
});

export class ServerAppConfig extends IntersectionType(BaseAppConfig, OrmConfig) { }

@Module({
    imports: [
        ConfigModule.registerAsync({ AppConfig: ServerAppConfig }),
        LoggerModule.register(),
        CoreModule.register(),
        AuthModule,
        DatabaseModule,
        CqrsErrorHandlerModule,
        QueueModule,
        TeamsModule,
        IssuesModule,
        IntegrationProjectModule,
        SprintsModule,
        SprintIssuesModule,
    ],
})
export class AppModule { }
