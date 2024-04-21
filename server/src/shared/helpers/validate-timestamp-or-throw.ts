import { NotFoundException } from '@nestjs/common';
import { isDate } from 'class-validator';

/**
 * @description Validates a Timestamp version 4 or throws a {@link NotFoundException}.
 *
 * This is meant to be used in Controller methods that receive a Timestamp as a route parameter.
 * @param timestamp The Timestamp version 4
 * @returns The valid Timestamp
 * @throws NotFoundException if the Timestamp is not valid
 */
export function validateTimestampOrThrow(timestamp: string): string {
    if (!isDate(timestamp)) {
        throw new NotFoundException();
    }

    return timestamp;
}
