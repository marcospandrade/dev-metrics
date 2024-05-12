import { IsString } from 'class-validator';

export class CheckSyncProjectEvent {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;
}
