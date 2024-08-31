import { IsString } from 'class-validator';

export class RegisterCustomFieldsCommand {
    @IsString()
    serverExternalId: string;

    @IsString()
    serverInternalId: string;

    @IsString()
    userEmail: string;
}
