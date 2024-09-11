import { Request } from 'express';

import { User } from '@modules/auth/entities/user.entity';

export type RequestUser = Request & { user: User };

interface ToNumberProps {
    default: number;
    min: number;
}

export function toNumber(value: any, props: ToNumberProps) {
    if (value === undefined || value === null) {
        return props.default;
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
        return props.default;
    }

    return parsedValue < props.min ? value.min : parsedValue;
}
