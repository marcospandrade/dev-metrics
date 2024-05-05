import { IsString } from 'class-validator';

export class NotifyProjectLoginEvent {
    @IsString()
    projectId: string;

    @IsString()
    url: string;
}
