import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, ManyToOne } from 'typeorm';
import { IsJSON, IsOptional, IsString } from 'class-validator';
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
    @Column({ unique: true })
    jiraIssueId: string;

    @ApiPropertyOptional({
        type: String,
        description: 'jiraIssueKey',
    })
    @IsString()
    @Column({ unique: true })
    jiraIssueKey: string;

    @ApiPropertyOptional({
        type: String,
        description: 'ticket description',
    })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    description?: string;

    @ApiProperty({
        type: String,
        description: 'projectId',
    })
    @IsString()
    @Column()
    projectId: string;

    @IsJSON()
    @IsOptional()
    @Column('jsonb', { nullable: false, default: {} })
    customFields: object;

    @ApiProperty({
        type: String,
        description: 'sprintId',
    })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    sprintId?: string;

    @ManyToOne(() => Project, project => project.issuesList)
    @Type(() => Project)
    project: Project;

    @ManyToOne(() => Sprint, sprint => sprint.issuesList)
    @Type(() => Sprint)
    sprint: Sprint;
}
