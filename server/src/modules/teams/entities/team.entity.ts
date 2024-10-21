import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Participant } from './participant.entity';
import { Type } from 'class-transformer';
import { Sprint } from '@modules/sprints/entities/sprint.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
    @ApiProperty({
        type: String,
        description: 'team name',
    })
    @IsString()
    @Column()
    teamName: string;

    @ApiProperty({
        type: String,
        description: 'team name',
    })
    @Column({ nullable: false })
    @IsUUID()
    createdById: string;

    @OneToMany(() => Participant, participant => participant.team)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Participant)
    participants?: Participant[];

    @ManyToOne(() => User, user => user.projects)
    createdBy?: User;

    @OneToMany(() => Sprint, sprint => sprint.teamId)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Sprint)
    sprints?: Sprint[];
}
