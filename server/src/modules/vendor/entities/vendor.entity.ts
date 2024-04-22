import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { Order } from '@modules/order/entities/order.entity';

export enum VendorStatus {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

@Entity({ name: 'vendors', synchronize: true })
export class Vendor extends Base {
    @ApiProperty({
        type: String,
        description: 'Vendors name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Vendor status',
    })
    @Column({ enum: VendorStatus, default: VendorStatus.ENABLED })
    status: VendorStatus;

    @ApiProperty({
        type: String,
        description: 'Prefix Microservice',
    })
    @IsUUID()
    @Column({ unique: true })
    key: string;

    @OneToMany(() => Order, order => order.vendor)
    order: Order;
}
