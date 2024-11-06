import { LoggerService } from '@core/logger/logger.service';
import { Provider } from '@nestjs/common';

import { QueryFailedFactory } from './query-failed.factory';

export const QueryFailedFactoryProvider: Provider = {
    provide: QueryFailedFactory,
    useFactory: (logger: LoggerService) => {
        return new QueryFailedFactory(logger);
    },
    inject: [LoggerService],
};
