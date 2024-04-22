import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { Project } from '@modules/project/entities/project.entity';

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

    @ApiProperty({
        type: String,
        description: 'picture',
    })
    @Column()
    picture: string;

    @ApiProperty({
        type: String,
        description: 'jobTitle',
    })
    @Column()
    jobTitle: string;

    @ApiProperty({
        type: String,
        description: 'cloudId',
    })
    @Column()
    cloudId: string;

    @ApiProperty({
        type: String,
        description: 'projects',
    })
    @OneToMany(() => Project, project => project.user)
    projects: Project;
}
