import { IsUUID } from 'class-validator';

export class GenerateSprintEstimatesCommand {
    @IsUUID()
    sprintId: string;
}
