import { HttpExceptionOptions, InternalServerErrorException } from '@nestjs/common';

export class InvalidValidationSchemaException extends InternalServerErrorException {
    public constructor(message = 'Invalid validation schema', descriptionOrOptions?: string | HttpExceptionOptions) {
        super(message, descriptionOrOptions);
    }
}
