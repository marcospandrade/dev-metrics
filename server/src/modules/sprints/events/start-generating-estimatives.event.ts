import { IsUUID } from 'class-validator';

export class StartGeneratingEstimativesEvent {
    @IsUUID()
    sprintId: string;
}
