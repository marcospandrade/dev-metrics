import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { LoggerService } from '@core/logger/logger.service';
import { ErrorResponse } from '../unhandled-exception/types/error-response';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class QueryFailedFactory {
    constructor(private logger: LoggerService) { }

    buildErrorResponse(error: QueryFailedError, request: Request): { response: ErrorResponse, status: number, customMessage: string } {
        const errorResponse: ErrorResponse = {
            requestId: request['id'] as string,
            path: request.url,
            message: error.message,
        };

        const mappedError = this.mapToHttpError(error);
        if (mappedError instanceof QueryFailedError) {
            return { response: errorResponse, status: 500, customMessage: 'Internal server error' };
        }

        return { response: errorResponse, status: mappedError.getStatus(), customMessage: mappedError.message };
    }

    private mapToHttpError(error: QueryFailedError): HttpException | QueryFailedError {
        const errorConstraint: string | undefined = error?.['constraint'];
        if (!errorConstraint) return error;

        if (errorConstraint.includes('sprints_teams_teamId')) {
            return new NotFoundException('Team not found');
        } else if (errorConstraint.includes('sprintIssues_issues_issueId')) {
            return new NotFoundException('Issue not found');
        }

        return error;
    }
}
