import { User } from '../entities/user.entity';

export interface TokenInfo extends User {
    exp: number;
    iat: number;
}
