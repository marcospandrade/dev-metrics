import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '@core/logger/logger.service';
import { ResponseMessage } from '../../decorators/response-message';

import { GenericHttpResponse } from './types/generic-http-response';

@Injectable()
export class FormatResponseFactory {
    constructor(
        private logger: LoggerService,
        private reflector: Reflector,
    ) {}

    mountGenericResponse<T>(data: T, context: ExecutionContext): GenericHttpResponse<T> {
        if (!data) {
            return {
                // TODO: check if this is the best way to handle this
                response: null,
                message: this.getResponseMessage(context),
            };
        }

        const response = {
            response: data,
            message: this.getResponseMessage(context),
        };

        return response;
        // const validationSchema = this.getValidationSchema(context);

        // if (!validationSchema) {
        //     return response;
        // }

        // const { transformControllerResponse: transform } = validationSchema;

        // if (Array.isArray(data) && typeof data[1] === 'number') {
        //     // paginated response
        //     response.response = {
        //         records: transform ? data[0].map(transform) : data[0],
        //         count: data[1],
        //     } as any;
        // } else {
        //     response.response = (transform ? transform(data) : data) as T;
        // }

        // return response;
    }

    isEventStreamResponse(context: ExecutionContext) {
        return context.switchToHttp().getResponse().getHeaders()['content-type']?.includes('text/event-stream');
    }

    private getResponseMessage(context: ExecutionContext) {
        const responseMessages = this.reflector.get(ResponseMessage, context.getHandler());

        return responseMessages ?? 'success';
    }

    // private getValidationSchema(context: ExecutionContext) {
    //     const schema = Reflect.getMetadata(VALIDATE_RESPONSE_SCHEMA_METADATA_KEY, context.getHandler());

    //     return schema as ValidateResponseSchemaMetadata<any>;
    // }
}
