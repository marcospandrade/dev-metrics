import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { Base } from '@core/database/entities/base.entity';
import { Project } from '@modules/integration-server/entities/project.entity';

@Entity({ name: 'issues' })
export class Issue extends Base {
    @ApiProperty({
        type: String,
        description: 'title',
    })
    @IsString()
    @Column()
    summary: string;

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

    @ApiProperty({
        type: String,
        description: 'projectId',
    })
    @IsString()
    @Column()
    projectId: string;

    @ApiProperty({
        type: String,
        description: 'sprintId',
    })
    @IsString()
    @Column()
    sprintId?: string;

    @ManyToOne(() => Project, project => project.issuesList)
    @Type(() => Project)
    project: Project;

    @ManyToOne(() => Sprint, sprint => sprint.issuesList)
    @Type(() => Sprint)
    sprint: Sprint;
}
