import { IsString } from 'class-validator';

export class GetAllIssuesFieldsDto {
    @IsString()
    public cloudId: string;

    @IsString()
    public userEmail: string;
}
