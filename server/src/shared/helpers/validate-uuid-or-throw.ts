import { NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';

/**
 * @description Validates a UUID version 4 or throws a {@link NotFoundException}.
 *
 * This is meant to be used in Controller methods that receive a UUID as a route parameter.
 * @param id The UUID version 4
 * @returns The valid UUID
 * @throws NotFoundException if the UUID is not valid
 */
export function validateUUIDOrThrow(id: string): string {
    if (!isUUID(id, 4)) {
        throw new NotFoundException();
    }

    return id;
}
