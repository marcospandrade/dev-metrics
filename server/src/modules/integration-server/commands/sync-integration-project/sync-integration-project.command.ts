import { IsString } from 'class-validator';

export class SyncIntegrationProjectCommand {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;
}
