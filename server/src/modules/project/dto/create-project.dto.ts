import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        type: String,
        description: 'jiraId',
    })
    @IsString()
    jiraId: string;

    @ApiProperty({
        type: String,
        description: 'name',
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        description: 'url',
    })
    @IsString()
    url: string;

    @ApiProperty({
        type: String,
        description: 'scopes',
    })
    @IsArray()
    scopes: string[];

    @ApiProperty({
        type: String,
        description: 'scopes',
    })
    @IsUUID()
    userId?: string;
}
