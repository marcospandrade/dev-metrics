import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { CoreService } from './core/core.service';
import { ValidationFailedException } from './core/exceptions/validation-failed-exception';

CoreService.bootstrap({
    globalPrefix: {
        prefix: 'api/v1',
        prefixOptions: {
            exclude: ['health-check', 'version'],
        },
    },
    appModule: AppModule,
    appOptions: {
        bufferLogs: true,
    },
    middlewares: [helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' })],
    useNats: true,
    // globalPipes: [
    //     new ValidationPipe({
    //         transform: true,
    //         transformOptions: {
    //             enableImplicitConversion: true,
    //             exposeUnsetFields: false,
    //         },
    //         exceptionFactory(errors) {
    //             return new ValidationFailedException({
    //                 validationErrors: errors,
    //             });
    //         },
    //     }),
    // ],
});
