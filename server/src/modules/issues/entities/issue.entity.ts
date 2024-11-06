import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsArray, IsJSON, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { Base } from '@core/database/entities/base.entity';
import { Project } from '@modules/integration-server/entities/project.entity';
import { SprintIssue } from '@modules/sprint-issues/entities/sprint-issue.entity';

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

    @ApiProperty({
        type: String,
        description: 'issueText',
    })
    @Column({ nullable: true })
    @Expose()
    @IsString()
    @IsOptional()
    @Transform(({ obj, value }) => {
        if (!!value || !obj.description || obj.description === 'null') return value;

        return Issue.traverseIssueDescription(obj.description);
    })
    issueText?: string;

    @IsJSON()
    @IsOptional()
    @Column('jsonb', { nullable: false, default: {} })
    customFields: object;

    @ManyToOne(() => Project, project => project.issuesList)
    @Type(() => Project)
    project: Project;

    @OneToMany(() => SprintIssue, sprint => sprint.issueId, {})
    @IsArray()
    @IsOptional()
    sprints?: SprintIssue[];

    private static traverseIssueDescription(issueDescription: Issue['description'], issueText = '') {
        const parsedIssueDescription =
            typeof issueDescription === 'string' ? JSON.parse(issueDescription) : issueDescription;

        if ('content' in parsedIssueDescription) {
            return parsedIssueDescription.content.reduce(
                (acc, item) => acc + this.traverseIssueDescription(item, issueText),
                '',
            );
        }

        if ('type' in parsedIssueDescription && parsedIssueDescription.type === 'text') {
            return issueText + ' ' + parsedIssueDescription.text;
        } else if ('attrs' in parsedIssueDescription && parsedIssueDescription.attrs.url) {
            return issueText + ' ' + parsedIssueDescription.attrs.url;
        }

        return issueText;
    }
}
