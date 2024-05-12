import { IsString } from 'class-validator';

export class UpsertRawProjectsEvent {
    @IsString()
    serverExternalId: string;

    @IsString()
    serverInternalId: string;

    @IsString()
    userEmail: string;
}
