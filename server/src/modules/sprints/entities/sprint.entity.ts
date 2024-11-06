import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsDate, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Team } from '@modules/teams/entities/team.entity';
import { Type } from 'class-transformer';
import { SprintIssue } from '@modules/sprint-issues/entities/sprint-issue.entity';

@Entity({ name: 'sprints' })
export class Sprint extends Base {
    @ApiProperty({
        type: String,
        description: 'name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'startDate',
    })
    @IsDate()
    @Column()
    startDate: Date;

    @ApiProperty({
        type: String,
        description: 'endDate',
    })
    @IsDate()
    @Column()
    endDate: Date;

    @ApiProperty({
        type: Array,
        description: 'scopes',
    })
    @IsString()
    @Column()
    goals: string;

    @Column({ nullable: false })
    @IsUUID()
    teamId: string;

    @Column({ nullable: false })
    @IsUUID()
    userId: string;

    @ManyToOne(() => Team, team => team.sprints)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Team)
    team?: Team;

    @OneToMany(() => SprintIssue, issue => issue.sprint, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
    issuesList?: SprintIssue[];

    @ManyToOne(() => User, user => user.projects)
    user?: User;
}
