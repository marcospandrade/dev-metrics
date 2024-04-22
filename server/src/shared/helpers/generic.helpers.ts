import { Request } from 'express';

import { User } from '@modules/auth/entities/user.entity';

export type RequestUser = Request & { user: User };
