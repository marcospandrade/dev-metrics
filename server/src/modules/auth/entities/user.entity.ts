import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { IntegrationServer } from '@modules/integration-server/entities/integration-server.entity';
import { Type } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends Base {
    @ApiProperty({
        type: String,
        description: 'Access Token Estimai',
    })
    @IsString()
    @Column({ unique: true })
    accessTokenEstimai: string;

    @ApiProperty({
        type: String,
        description: 'Access Token Atlassian',
    })
    @IsString()
    @Column({ unique: true })
    accessTokenAtlassian: string;

    @ApiProperty({
        type: String,
        description: 'expiresAt',
    })
    @IsString()
    @Column()
    expiresAt: string;

    @ApiProperty({
        type: String,
        description: 'refreshToken',
    })
    @IsString()
    @Column()
    refreshToken: string;

    @ApiProperty({
        type: String,
        description: 'User state',
    })
    @IsString()
    @Column({ unique: true })
    state: string;

    @ApiProperty({
        type: String,
        description: 'User name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'email',
    })
    @Column({ unique: true })
    email: string;

    @ApiPropertyOptional({
        type: String,
        description: 'picture',
    })
    @IsString()
    @IsOptional()
    @Column()
    picture?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'jobTitle',
    })
    @IsString()
    @IsOptional()
    @Column()
    jobTitle?: string;

    @IsOptional()
    @Type(() => IntegrationServer)
    @OneToMany(() => IntegrationServer, project => project.userId)
    projects?: IntegrationServer[];
}
