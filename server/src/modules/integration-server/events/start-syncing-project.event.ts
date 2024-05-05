import { IsString } from 'class-validator';

export class StartSyncingProjectEvent {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;
}
