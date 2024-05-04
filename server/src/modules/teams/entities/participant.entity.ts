import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
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

    @ApiPropertyOptional({
        type: Number,
        description: 'capacity in story points',
    })
    @IsNumber()
    @IsOptional()
    @Column({ nullable: true })
    capacity?: number;

    @ApiPropertyOptional({
        type: String,
        description: 'role',
    })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    role?: string;

    @ApiProperty({
        type: Boolean,
        description: 'isActive',
    })
    @IsBoolean()
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({
        type: String,
        description: 'team id',
    })
    @Column({ nullable: false })
    teamId: string;

    @ManyToOne(() => Team, team => team.participants)
    team?: Team;
}
