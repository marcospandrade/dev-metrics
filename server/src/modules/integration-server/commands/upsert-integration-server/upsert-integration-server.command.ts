import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class UpsertIntegrationServerCommand {
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

    @ApiPropertyOptional({
        type: String,
        description: 'avatarUrl',
    })
    @IsString()
    avatarUrl?: string;

    @ApiProperty({
        type: String,
        description: 'user id ',
    })
    @IsString()
    @IsUUID()
    userId: string;
}
