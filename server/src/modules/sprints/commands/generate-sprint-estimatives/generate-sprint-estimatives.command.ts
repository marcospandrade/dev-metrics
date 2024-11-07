import { IsUUID } from 'class-validator';

export class GenerateSprintEstimativesCommand {
    @IsUUID()
    sprintId: string;
}
