import { IsString } from 'class-validator';

export class GetSpecificIssueDTO {
    @IsString()
    issueId: string;

    @IsString()
    cloudId: string;

    @IsString()
    userEmail: string;

    @IsString()
    query?: string;
}
