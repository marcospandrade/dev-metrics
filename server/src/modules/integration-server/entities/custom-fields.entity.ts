import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

import { IntegrationServer } from './integration-server.entity';
import { Base } from '@core/database/entities/base.entity';

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
        description: 'integration server id',
    })
    @IsString()
    @Column({ nullable: false })
    integrationServerId: string;

    @ApiProperty({
        type: Boolean,
        description: 'isStoryPointFiled',
    })
    @IsBoolean()
    @Column({ default: false })
    isStoryPointField: boolean;

    @ManyToOne(() => IntegrationServer, integrationServer => integrationServer.customFields)
    @Type(() => IntegrationServer)
    integrationServer: IntegrationServer;
}
