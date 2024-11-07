import { IsUUID } from 'class-validator';

export class FindAllIssuesQuery {
    @IsUUID()
    projectId: string;
}
