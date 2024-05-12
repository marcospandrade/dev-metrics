import { IsString } from 'class-validator';

export class UpsertProjectsCommand {
    @IsString()
    serverExternalId: string;

    @IsString()
    serverInternalId: string;

    @IsString()
    userEmail: string;
}
