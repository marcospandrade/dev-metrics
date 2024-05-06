import { IsString } from 'class-validator';

export class GetProjectSyncStatusQuery {
    @IsString()
    jiraId: string;
}
