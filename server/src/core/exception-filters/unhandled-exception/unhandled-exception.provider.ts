import { LoggerService } from '@core/logger/logger.service';
import { Provider } from '@nestjs/common';

import { UnhandledExceptionFactory } from './unhandled-exception.factory';

export const UnhandledExceptionFactoryProvider: Provider = {
    provide: UnhandledExceptionFactory,
    useFactory: (logger: LoggerService) => {
        return new UnhandledExceptionFactory(logger);
    },
    inject: [LoggerService],
};
