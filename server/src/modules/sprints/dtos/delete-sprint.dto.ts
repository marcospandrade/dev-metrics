import { IsUUID } from 'class-validator';

export class DeleteSprintDto {
    @IsUUID()
    sprintId: string;
}
