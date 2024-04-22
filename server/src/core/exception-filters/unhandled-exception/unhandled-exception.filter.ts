import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';

import { InterceptedError } from './types/intercepted-error';
import { LoggerService } from '@core/logger/logger.service';
import { ValidationFailedException } from '@core/exceptions/validation-failed-exception';
import { ErrorResponse } from './types/error-response';

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: InterceptedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = this.determineStatus(exception);
        const errorResponse = this.buildErrorResponse(exception, request);

        this.logError(exception, request);

        return response.status(status).json(errorResponse);
    }

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

    private determineStatus(exception: InterceptedError): number {
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

    private logError(exception: InterceptedError, request: Request): void {
        this.logger.error(
            {
                requestId: request['id'],
                path: request.url,
                stack: exception.stack,
                ...(exception['validationErrors'] && {
                    validationErrors: exception['validationErrors'],
                }),
                ...(exception['options'] && {
                    options: exception['options'],
                }),
            },
            'Unhandled exception',
        );
    }
}
