import { IsString } from 'class-validator';
import { Project } from '../../project/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'code',
    })
    @IsString()
    code: string;

    @ApiProperty({
        type: String,
        description: 'state',
    })
    @IsString()
    state: string;
}

export interface ICreateUserDTO {
    state: string;
    accessTokenEstimai: string;
    accessTokenAtlassian: string;
    expiresAt: string;
    refreshToken: string;
    name: string;
    email: string;
    picture?: string;
    jobTitle?: string;
    project: Partial<Project>;
}
