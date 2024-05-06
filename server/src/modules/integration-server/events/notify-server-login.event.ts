import { IsArray, IsString, ValidateNested } from 'class-validator';

export class NotifyServerLoginEvent {
    @IsString()
    id: string;

    @IsString()
    url: string;

    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    scopes: string[];

    @IsString()
    avatarUrl?: string;

    @IsString()
    userId: string;
}
