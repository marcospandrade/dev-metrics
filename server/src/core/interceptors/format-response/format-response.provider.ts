import { LoggerService } from '@core/logger/logger.service';
import { Reflector } from '@nestjs/core';
import { Provider } from '@nestjs/common';

import { FormatResponseFactory } from './format-response.factory';

export const FormatResponseFactoryProvider: Provider = {
    provide: FormatResponseFactory,
    useFactory: (logger: LoggerService, reflector: Reflector) => {
        return new FormatResponseFactory(logger, reflector);
    },
    inject: [LoggerService, Reflector],
};
