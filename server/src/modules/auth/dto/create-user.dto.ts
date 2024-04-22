import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import { CreateProjectDto } from '@modules/project/dto/create-project.dto';

export class CreateUserDto {
    @IsString()
    state: string;

    @IsString()
    accessTokenEstimai: string;

    @IsString()
    accessTokenAtlassian: string;

    @IsString()
    expiresAt: string;

    @IsString()
    refreshToken: string;

    @IsString()
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    picture?: string;

    @IsOptional()
    @IsString()
    jobTitle?: string;

    @IsObject()
    project: CreateProjectDto;
}
