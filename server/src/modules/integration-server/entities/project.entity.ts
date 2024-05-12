import { Base } from '@core/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
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

    @ApiProperty({
        type: Boolean,
        description: 'issues synced',
    })
    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    isSynced: boolean;

    @ApiProperty({
        type: String,
        description: 'integration server id',
    })
    @IsString()
    @Column()
    integrationServerId: string;

    @ApiProperty({
        type: Boolean,
        description: 'integrationUUID',
    })
    @IsUUID()
    @Column()
    integrationUUID: string;

    @ManyToOne(() => IntegrationServer, integrationServer => integrationServer.projects)
    @Type(() => IntegrationServer)
    integrationServer: IntegrationServer;
}