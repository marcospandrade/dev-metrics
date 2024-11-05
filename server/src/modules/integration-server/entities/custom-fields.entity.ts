import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

import { Base } from '@core/database/entities/base.entity';
import { Project } from './project.entity';

@Entity('customFields')
export class CustomFields extends Base {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @Column({ unique: true })
    atlassianId: string;

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @Column()
    type: string;

    @ApiProperty({
        type: String,
        description: 'project id',
    })
    @IsUUID()
    @Column({ nullable: false })
    projectId: string;

    @ManyToOne(() => Project, project => project.customFields)
    @Type(() => Project)
    project: Project;
}
