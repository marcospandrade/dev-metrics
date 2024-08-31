import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { Base } from '@core/database/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Project } from './project.entity';
import { CustomFields } from './custom-fields.entity';

@Entity({ name: 'integration_servers' })
@Unique('jira-server', ['jiraId', 'url'])
export class IntegrationServer extends Base {
    @ApiProperty({
        type: String,
        description: 'jiraId',
    })
    @IsString()
    @Column({ unique: true })
    jiraId: string;

    @ApiProperty({
        type: String,
        description: 'name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'url',
    })
    @IsString()
    @Column({ unique: true })
    url: string;

    @ApiProperty({
        type: String,
        description: 'scopes',
    })
    @Column()
    @Transform(scopes => JSON.stringify(scopes))
    scopes: string;

    @ApiProperty({
        type: String,
        description: 'userId',
    })
    @Column()
    @IsString()
    userId: string;

    @ManyToOne(() => User, user => user.projects)
    @Type(() => User)
    user: User;

    @OneToMany(() => Project, project => project.integrationServer)
    projects: Project[];

    @OneToMany(() => CustomFields, customField => customField.integrationServer)
    customFields: CustomFields[];
}
