import { IsString } from 'class-validator';

export class NotifyServerLoginEvent {
    @IsString()
    projectId: string;
}
