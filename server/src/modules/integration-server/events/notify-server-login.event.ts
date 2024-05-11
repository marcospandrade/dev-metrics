import { IsArray, IsString } from 'class-validator';

export class NotifyServerLoginEvent {
    @IsString()
    id: string;

    @IsString()
    url: string;

    @IsString()
    name: string;

    @IsArray()
    scopes: string[];

    @IsString()
    avatarUrl?: string;

    @IsString()
    userId: string;
}
