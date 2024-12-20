import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

import { Base } from '@core/database/entities/base.entity';
import { Project } from './project.entity';

@Entity('customFields')
@Index(['atlassianId', 'projectId'], { unique: true })
export class CustomFields extends Base {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @Column()
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
        type: Boolean,
        description: 'isStoryPointFiled',
    })
    @IsBoolean()
    @Column({ default: false })
    isStoryPointField: boolean;

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
