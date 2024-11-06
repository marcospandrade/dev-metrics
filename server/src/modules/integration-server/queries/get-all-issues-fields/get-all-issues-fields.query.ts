import { IsString } from 'class-validator';

export class GetAllIssuesFieldsQuery {
    @IsString()
    userEmail: string;

    @IsString()
    projectId: string;
}
