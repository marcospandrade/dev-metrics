import { IsString } from 'class-validator';

export class UpsertCustomFieldDto {
    @IsString()
    atlassianId: string;

    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    integrationServerId: string;
}
