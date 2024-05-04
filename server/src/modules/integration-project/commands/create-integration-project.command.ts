import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateIntegrationProjectCommand {
    @ApiProperty({
        type: String,
        description: 'jiraId',
    })
    @IsString()
    id: string;

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
        description: 'avatarUrl',
    })
    @IsString()
    avatarUrl?: string;
}
