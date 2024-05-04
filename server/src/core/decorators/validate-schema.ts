/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClassConstructor } from 'class-transformer';
import { SchemaValidator } from '@core/utils';

import { ValidationFailedException } from '../exceptions/validation-failed-exception';

/**
 * @description Uses {@link SchemaValidator.validate} to validate a function parameter object
 *
 * Transforms the function parameter object to the class-validator decorated instance and validates it
 * @example
 * ```ts
 * export class YourClass {
 *     _@ValidateSchema(ClassValidatorSchema)
 *     async execute(schema: ClassValidatorSchema) {
 *      // schema is now a class-validator decorated instance
 * }
 * ```
 * @throws A {@link ValidationFailedException} if the schema validation fails which will be handled by the global exception filter
 * @param schema The class-validator decorated class to validate
 */
export function ValidateSchema(schema: ClassConstructor<any>): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (functionParameter: object) {
            if (!functionParameter || typeof functionParameter !== 'object') {
                throw new ValidationFailedException({
                    message: 'Invalid validation instance',
                });
            } else if (!schema) {
                throw new ValidationFailedException({
                    message: 'Invalid schema for instance validation',
                });
            }

            const instance = SchemaValidator.validate(functionParameter, schema);

            return originalMethod.call(this, instance);
        };

        return descriptor;
    };
}
