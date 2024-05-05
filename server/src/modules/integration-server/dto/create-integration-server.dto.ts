import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateIntegrationServerDto {
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
    scopes: string;

    @ApiProperty({
        type: String,
        description: 'userId',
    })
    @IsUUID()
    userId?: string;
}
