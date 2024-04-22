import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Participant } from './participant.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
    @ApiProperty({
        type: String,
        description: 'team name',
    })
    @IsString()
    @Column()
    teamName: string;

    @OneToMany(() => Participant, participant => participant.team)
    participants: Participant[];

    @ManyToOne(() => User, user => user.projects)
    createdBy?: User;
}
