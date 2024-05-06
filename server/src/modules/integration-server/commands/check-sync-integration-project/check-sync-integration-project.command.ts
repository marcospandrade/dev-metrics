import { IsString } from 'class-validator';

export class CheckSyncIntegrationProjectCommand {
    @IsString()
    externalId: string;
}
