import { IsString } from 'class-validator';

export class SyncRelevantCustomFieldsEvent {
    @IsString()
    serverExternalId: string;

    @IsString()
    serverInternalId: string;

    @IsString()
    userEmail: string;
}
