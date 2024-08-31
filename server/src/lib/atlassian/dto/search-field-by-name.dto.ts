import { IsString } from 'class-validator';

export class SearchFieldByNameDto {
    @IsString()
    public fieldName: string;

    @IsString()
    public cloudId: string;

    @IsString()
    public userEmail: string;
}
