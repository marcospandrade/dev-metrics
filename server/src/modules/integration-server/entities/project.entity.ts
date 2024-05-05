import { Base } from '@core/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IntegrationServer } from './integration-server.entity';
import { Type } from 'class-transformer';

@Entity('projects')
export class Project extends Base {
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
    @Column({ unique: true })
    key: string;

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
    projectTypeKey: string;

    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    isPrivate: boolean;

    @IsString()
    @Column()
    integrationServerId: string;

    @ManyToOne(() => IntegrationServer, integrationServer => integrationServer.projects)
    @Type(() => IntegrationServer)
    integrationServer: IntegrationServer;
}
