import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';

import { LoggerService } from '@core/logger/logger.service';
import { ErrorResponse } from '../unhandled-exception/types/error-response';

@Injectable()
export class AxiosFactory {
    constructor(private logger: LoggerService) {}

    buildErrorResponse(error: AxiosError, request: Request): ErrorResponse {
        const errorResponse: ErrorResponse = {
            requestId: request['id'] as string,
            path: request.url,
            message: error.message,
        };

        if (!error.response) {
            this.logger.warn(error, 'AxiosError has no response');

            return errorResponse;
        }

        const hasResponseError = typeof error.response.data === 'object' && 'error' in error.response.data;

        let parsedError: any;

        if (hasResponseError) {
            parsedError = error.response.data['error'];
        }

        if (!hasResponseError || typeof error.response.data === 'string') {
            parsedError = error.response.data['error'];
        }

        if (typeof parsedError === 'string') {
            errorResponse.message = parsedError;
        } else if (typeof parsedError === 'object') {
            errorResponse.message = parsedError.message;
        }

        return errorResponse;
    }

    determineStatus(exception: AxiosError): number {
        if (exception.response) {
            return exception.response.status;
        }

        return 500;
    }
}
