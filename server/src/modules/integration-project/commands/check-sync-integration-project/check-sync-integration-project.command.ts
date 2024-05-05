import { IsString } from 'class-validator';

export class CheckSyncIntegrationProjectCommand {
    @IsString()
    projectId: string;
}