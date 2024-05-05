import { IsString } from 'class-validator';

export class GetAccessibleResourcesDTO {
    @IsString()
    userEmail: string;
}
