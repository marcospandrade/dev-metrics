import { Module } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';

import * as dotenv from 'dotenv';
import * as path from 'path';

import { OrderModule } from './modules/order/order.module';
import { EventModule } from './modules/event/event.module';
import { BaseAppConfig, ConfigModule } from '@core/config/config.module';
import { LoggerModule } from '@core/logger/logger.module';
import { CoreModule } from '@core/core.module';
import { QueueModule } from './modules/queue/queue.module';
import { EventStacksModule } from './modules/event-stacks/event-stacks.module';
import { OrmConfig } from '@core/config/sources/database.config';
import { DatabaseModule } from '@core/database/database.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { CqrsErrorHandlerModule } from '@core/cqrs-error-handler/cqrs-error-handler.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { IssuesModule } from './modules/issues/issues.module';
import { IntegrationProjectModule } from './modules/integration-project/integration-project.module';

dotenv.config({
    debug: true,
    encoding: 'utf8',
    path: path.resolve(process.cwd(), '.env'),
});

export class ServerAppConfig extends IntersectionType(BaseAppConfig, OrmConfig) {}

@Module({
    imports: [
        ConfigModule.registerAsync({ AppConfig: ServerAppConfig }),
        LoggerModule.register(),
        CoreModule.register(),
        AuthModule,
        DatabaseModule,
        CqrsErrorHandlerModule,
        EventStacksModule,
        QueueModule,
        OrderModule,
        EventModule,
        VendorModule,
        TeamsModule,
        IssuesModule,
        IntegrationProjectModule,
    ],
})
export class AppModule {}
