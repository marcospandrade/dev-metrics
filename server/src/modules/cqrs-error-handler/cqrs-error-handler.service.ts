import { LoggerService } from '@core/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { UnhandledExceptionBus } from '@nestjs/cqrs';
import { tap } from 'rxjs';

@Injectable()
export class CqrsErrorHandlerService {
    private asyncLogger: ReturnType<LoggerService['createChildLogger']>;

    constructor(
        private logger: LoggerService,
        private exceptionBus: UnhandledExceptionBus,
    ) {
        this.asyncLogger = this.logger.createChildLogger({
            async: true,
        });
    }

    async onApplicationBootstrap() {
        this.handle();
    }

    handle() {
        this.exceptionBus
            .pipe(
                tap(async (exception) => {
                    const error = exception.exception;

                    if (error) {
                        this.asyncLogger.error(error, 'Unhandled exception');
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { exception: _, ...rest } = exception;
                    this.asyncLogger.error(rest, 'Unhandled exception meta');
                }),
            )
            .subscribe();
    }
}
