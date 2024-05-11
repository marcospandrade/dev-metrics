import { IsString } from 'class-validator';

export class StartSyncingProjectEvent {
    @IsString()
    serverId: string;

    @IsString()
    userEmail: string;
}
