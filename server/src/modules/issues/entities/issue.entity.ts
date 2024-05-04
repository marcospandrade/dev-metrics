import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Base } from '@core/database/entities/base.entity';

@Entity({ name: 'issues' })
export class Issue extends Base {
    @ApiProperty({
        type: String,
        description: 'title',
    })
    @IsString()
    @Column()
    title: string;

    @ApiPropertyOptional({
        type: String,
        description: 'jiraIssueId',
    })
    @IsString()
    @IsOptional()
    @Column()
    jiraIssueId?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'jiraIssueKey',
    })
    @IsString()
    @IsOptional()
    @Column()
    jiraIssueKey?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'ticket description',
    })
    @IsString()
    @IsOptional()
    @Column()
    description?: string;

    @ManyToOne(() => Sprint, sprint => sprint.issuesList)
    @Type(() => Sprint)
    sprint: Sprint;

    @ManyToOne(() => User, user => user.projects)
    @Type(() => User)
    user: User;
}
