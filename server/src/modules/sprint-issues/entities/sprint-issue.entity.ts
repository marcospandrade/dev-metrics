import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { Base } from '@core/database/entities/base.entity';
import { Issue } from '@modules/issues/entities/issue.entity';

@Entity({ name: 'sprintIssues' })
@Index(['sprintId', 'issueId'], { unique: true })
export class SprintIssue extends Base {
    @Column()
    @IsUUID()
    sprintId: string;

    @Column()
    @IsUUID()
    issueId: string;

    @ManyToOne(() => Sprint, sprint => sprint.issuesList)
    @JoinColumn({ name: 'sprintId', referencedColumnName: 'id' })
    @Type(() => Sprint)
    sprint?: Sprint;

    @ManyToOne(() => Issue, issue => issue.sprints)
    @JoinColumn({ name: 'issueId', referencedColumnName: 'id' })
    @Type(() => Issue)
    issue?: Issue;
}
