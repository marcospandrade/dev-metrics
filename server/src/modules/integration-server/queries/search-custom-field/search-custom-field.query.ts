import { IsString } from 'class-validator';

export class SearchCustomFieldQuery {
    @IsString()
    cloudId: string;

    @IsString()
    userEmail: string;

    @IsString()
    fieldName: string;
}
