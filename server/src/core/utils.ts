import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer';
import { ValidationError, ValidatorOptions, getMetadataStorage, validateSync } from 'class-validator';

import { ValidationFailedException } from './exceptions/validation-failed-exception';
import { InvalidValidationSchemaException } from './exceptions/invalid-validation-schema-exception';

export type MaybePromise<T> = T | Promise<T>;

/**
 * Get the values of an object with string or number values.
 * @template AnyObject - The object type.
 * @returns The union of object values.
 *
 * @example```
 * export const UserRolesEnum = {
 *      USER: 'user',
 *      ADMIN: 'admin',
 * } as const;
 *
 * export type UserRoles = ValuesOf<typeof UserRolesEnum>;
 * // results in type: 'user' | 'admin'
 * ```
 */
export type ValuesOf<AnyObject extends Record<string, string | number>> = AnyObject[keyof AnyObject];

export type Constructable<T extends object> = new (...args: any[]) => T;

export class SchemaValidator {
    public static validate<T extends object>(
        data: T,
        schema: ClassConstructor<T>,
        validationOpts?: ValidatorOptions,
        fatalErrorDescription?: string,
        throwOnErrors = true,
    ) {
        SchemaValidator.checkIsSchema(schema, fatalErrorDescription);
        SchemaValidator.checkIsInstance(data, fatalErrorDescription);

        const validationErrors = SchemaValidator.validateSync(data, validationOpts);

        if (throwOnErrors && validationErrors.length > 0) {
            throw new ValidationFailedException({ validationErrors });
        }

        return data;
    }

    public static toInstance<T extends object>(
        data: T,
        schema: ClassConstructor<T>,
        opts?: ClassTransformOptions,
        fatalErrorDescription?: string,
    ) {
        SchemaValidator.checkIsSchema(schema, fatalErrorDescription);

        return plainToInstance(schema, data, {
            enableImplicitConversion: true,
            ...(opts || {}),
        });
    }

    public static toPlain<T extends object>(
        schema: ClassConstructor<T>,
        data: unknown,
        opts?: ClassTransformOptions,
        fatalErrorDescription?: string,
    ) {
        // TODO: Remove this when ClassSerializerInterceptor runs in correct order
        // (when all decorators finished their work)
        if (typeof data === 'object') {
            for (const key in data) {
                if (data[key] === null) {
                    delete data[key];
                }
            }
        }

        SchemaValidator.checkIsSchema(schema, fatalErrorDescription);

        return SchemaValidator.toInstance(data as any, schema, {
            excludeExtraneousValues: true,
            ...(opts || {}),
        });
    }

    public static getInstanceMetadata(instance: Record<string, any>) {
        return getMetadataStorage().getTargetValidationMetadatas(
            instance?.constructor as any,
            instance as any,
            false,
            false,
            [],
        );
    }

    public static getMetadata(schema: ClassConstructor<any>) {
        return getMetadataStorage().getTargetValidationMetadatas(schema, new schema() as any, false, false, []);
    }

    public static checkIsSchema<T extends object>(schema: ClassConstructor<T>, fatalErrorDescription?: string) {
        if (!schema || typeof schema !== 'function' || !schema.prototype) {
            throw new InvalidValidationSchemaException(fatalErrorDescription);
        }

        SchemaValidator.checkIsClassValidatorSchema(schema);
    }

    private static validateSync<T extends object>(instance: T, opts?: ValidatorOptions): ValidationError[] {
        SchemaValidator.checkIsClassValidatorSchema(instance?.constructor as any);

        return validateSync(instance, {
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            ...(opts || {}),
        });
    }

    private static checkIsInstance<T extends object>(instance: T, fatalErrorDescription?: string) {
        if (SchemaValidator.getInstanceMetadata(instance).length === 0) {
            throw new InvalidValidationSchemaException(fatalErrorDescription);
        }
    }

    private static checkIsClassValidatorSchema<T extends object>(
        schema: ClassConstructor<T>,
        fatalErrorDescription?: string,
    ) {
        if (
            getMetadataStorage().getTargetValidationMetadatas(schema, new schema() as any, false, false, []).length ===
            0
        ) {
            const msg =
                fatalErrorDescription ??
                'Invalid validation schema. Make sure to decorate with valid class-validator decorators.';

            throw new InvalidValidationSchemaException(msg, {
                cause: schema,
            });
        }
    }
}
