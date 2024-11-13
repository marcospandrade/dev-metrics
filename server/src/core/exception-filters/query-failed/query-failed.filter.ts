import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LoggerService } from '@core/logger/logger.service';

import { QueryFailedFactory } from './query-failed.factory';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
    constructor(
        private logger: LoggerService,
        private factory: QueryFailedFactory,
    ) {}

    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const { response: errorResponse, status, customMessage } = this.factory.buildErrorResponse(exception, request);

        this.logError(exception, request, exception.message, customMessage);
        errorResponse.message = customMessage;

        response.status(status).json(errorResponse);
    }

    private async logError(
        exception: QueryFailedError,
        request: Request,
        originalMessage: string,
        customMessage: string,
    ) {
        this.logger.warn(
            {
                requestId: request['id'],
                path: request.url,
                originalMessage,
                customMessage,
                exception,
            },
            'QueryFailed exception',
        );
    }
}
