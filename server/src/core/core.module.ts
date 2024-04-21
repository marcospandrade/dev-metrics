import { DynamicModule, Module } from '@nestjs/common';

import { LoggerService } from './logger/logger.service';
import { CoreService } from './core.service';
import { APP_FILTER } from '@nestjs/core';
import { UnhandledExceptionFilter } from './exception-filters/unhandled-exception/unhandled-exception.filter';

/**
 * This module is the main module that bootstraps the Nest application.
 *
 * It provides bootstrap function through the {@link CoreService}, which can be used in main.ts.
 *
 * @example
 * // In main.ts
 * const options: CoreModuleOptions = {
 *   appModule: AppModule,
 *   appOptions: { bufferLogs: true }
 *   ...
 * };
 * CoreService.bootstrap(options);
 */
@Module({})
export class CoreModule {
    static register(): DynamicModule {
        return {
            global: true,
            module: CoreModule,
            providers: [
                CoreService,
                {
                    provide: APP_FILTER,
                    useFactory: (logger: LoggerService) => {
                        logger.info('Registering UnhandledExceptionFilter');

                        return new UnhandledExceptionFilter(logger);
                    },
                    inject: [LoggerService],
                },
                {
                    provide: LoggerService,
                    useValue: new LoggerService(),
                },
            ],
            exports: [CoreService],
        };
    }
}
