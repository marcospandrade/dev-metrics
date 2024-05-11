import { IsString } from 'class-validator';

export class CheckSyncProjectEvent {
    @IsString()
    cloudId: string;

    @IsString()
    userEmail: string;
}
