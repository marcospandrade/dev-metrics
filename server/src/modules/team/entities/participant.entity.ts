import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { Team } from './team.entity';

@Entity({ name: 'participants' })
export class Participant extends Base {
    @ApiProperty({
        type: String,
        description: 'name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: Number,
        description: 'capacity in story points',
    })
    @IsNumber()
    @Column()
    capacity?: number;

    @ApiProperty({
        type: String,
        description: 'role',
    })
    @IsString()
    @Column()
    role?: string;

    @ApiProperty({
        type: Boolean,
        description: 'isActive',
    })
    @IsBoolean()
    @Column()
    isActive: boolean;

    @ApiProperty({
        type: String,
        description: 'team id',
    })
    @ManyToOne(() => Team, team => team.participants)
    team: Team;
}
