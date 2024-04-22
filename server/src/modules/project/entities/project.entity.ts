import { Base } from '@core/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'projects' })
export class Project extends Base {
    @ApiProperty({
        type: String,
        description: 'jiraId',
    })
    @IsString()
    @Column()
    jiraId: string;

    @ApiProperty({
        type: String,
        description: 'name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'url',
    })
    @IsString()
    @Column()
    url: string;

    @ApiProperty({
        type: String,
        description: 'scopes',
    })
    @IsString()
    @Column()
    scopes: string;

    @ManyToOne(() => User, user => user.projects)
    user: User;
}
