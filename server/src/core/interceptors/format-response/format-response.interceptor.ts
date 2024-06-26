import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { LoggerService } from '@core/logger/logger.service';

import { FormatResponseFactory } from './format-response.factory';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
    constructor(
        private logger: LoggerService,
        private factory: FormatResponseFactory,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((value: any) => {
                if (this.factory.isEventStreamResponse(context)) {
                    return value;
                }

                return this.factory.mountGenericResponse(value, context);
            }),
        );
    }
}
