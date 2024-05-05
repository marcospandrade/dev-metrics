import { IsString } from 'class-validator';

export class GetPaginatedProjectsDTO {
    @IsString()
    cloudId: string;

    @IsString()
    userEmail: string;
}
