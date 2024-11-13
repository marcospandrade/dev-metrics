import { IsUUID } from 'class-validator';

export class StartGeneratingEstimatesEvent {
    @IsUUID()
    sprintId: string;
}
