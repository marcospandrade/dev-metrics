import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { LoggerService } from './logger/logger.service';
import { CoreService } from './core.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UnhandledExceptionFilter } from './exception-filters/unhandled-exception/unhandled-exception.filter';
import { AxiosFactory } from './exception-filters/axios/axios.factory';
import { AxiosFilter } from './exception-filters/axios/axios.filter';
import { FormatResponseFactory } from './interceptors/format-response/format-response.factory';
import { FormatResponseInterceptor } from './interceptors/format-response/format-response.interceptor';
import { AxiosFactoryProvider } from './exception-filters/axios/axios.provider';

import { FormatResponseFactoryProvider } from './interceptors/format-response/format-response.provider';
import { UnhandledExceptionFactoryProvider } from './exception-filters/unhandled-exception/unhandled-exception.provider';

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
            imports: [CqrsModule.forRoot()],
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
                    provide: APP_FILTER,
                    useFactory: (logger: LoggerService, factory: AxiosFactory) => {
                        logger.info('Registering AxiosFilter');

                        return new AxiosFilter(logger, factory);
                    },
                    inject: [LoggerService, AxiosFactory],
                },
                {
                    provide: APP_INTERCEPTOR,
                    useFactory: (logger: LoggerService, factory: FormatResponseFactory) => {
                        logger.info('Registering FormatResponseInterceptor');

                        return new FormatResponseInterceptor(logger, factory);
                    },
                    inject: [LoggerService, FormatResponseFactory],
                },
                {
                    provide: LoggerService,
                    useValue: new LoggerService(),
                },
                UnhandledExceptionFactoryProvider,
                FormatResponseFactoryProvider,
                AxiosFactoryProvider,
            ],
            exports: [
                CoreService,
                UnhandledExceptionFactoryProvider,
                FormatResponseFactoryProvider,
                AxiosFactoryProvider,
            ],
        };
    }
}
