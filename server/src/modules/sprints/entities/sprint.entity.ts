import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Issue } from '@modules/issues/entities/issue.entity';

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

    @OneToMany(() => Issue, issue => issue.id)
    issuesList?: Issue[];

    @ManyToOne(() => User, user => user.projects)
    user?: User;
}
