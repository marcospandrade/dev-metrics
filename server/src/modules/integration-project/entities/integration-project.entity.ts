import { Base } from '@core/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Transform, Type } from 'class-transformer';

@Entity({ name: 'integration_projects' })
export class IntegrationProject extends Base {
    @ApiProperty({
        type: String,
        description: 'jiraId',
    })
    @IsString()
    @Column({ unique: true })
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
    @Column({ unique: true })
    url: string;

    @ApiProperty({
        type: Boolean,
        description: 'issues synced',
    })
    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    isSynced: boolean;

    @ApiProperty({
        type: String,
        description: 'scopes',
    })
    @Column()
    @Transform(scopes => JSON.stringify(scopes))
    scopes: string;

    @ApiProperty({
        type: String,
        description: 'userId',
    })
    @Column()
    @IsString()
    userId: string;

    @ManyToOne(() => User, user => user.projects)
    @Type(() => User)
    user: User;
}
