import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { LoggerService } from '@core/logger/logger.service';
import { ValidationFailedException } from '../../exceptions/validation-failed-exception';

import { ErrorResponse } from './types/error-response';
import { InterceptedError } from './types/intercepted-error';

@Injectable()
export class UnhandledExceptionFactory {
    constructor(private logger: LoggerService) {}

    buildErrorResponse(exception: InterceptedError, request: Request): ErrorResponse {
        const errorResponse: ErrorResponse = {
            requestId: request['id'] as string,
            path: request.url,
            message: exception.message,
        };

        if (exception instanceof ValidationFailedException) {
            errorResponse.validationErrors = exception.validationErrors;
            errorResponse.message = this.concatErrorMessages(exception.validationErrors);
        }

        return errorResponse;
    }

    determineStatus(exception: InterceptedError): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        } else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    private concatErrorMessages(errors: Record<string, any>[]) {
        let errorMessage = '';

        // Helper function to recursively traverse each error object
        function traverseError(errorObj, path = '') {
            if (errorObj.hasOwnProperty('constraints')) {
                for (const key in errorObj.constraints) {
                    // errorMessage += `${path}${errorObj.property}: ${errorObj.constraints[key]}\n`;
                    errorMessage += `${errorObj.constraints[key]}\n`;
                }
            }
            if (errorObj.children && errorObj.children.length > 0) {
                errorObj.children.forEach(child => traverseError(child, `${path}${errorObj.property}.`));
            }
        }

        errors.forEach(error => traverseError(error));
        return errorMessage.trim(); // Trim any leading or trailing whitespace
    }
}
