import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from '@core/database/entities/base.entity';
import { Vendor } from '@modules/vendor/entities/vendor.entity';

export enum OrderStatus {
    STARTED = 'started',
    IN_PROGRESS = 'in_progress',
    FINISHED = 'finished',
}

@Entity({ name: 'orders', synchronize: true })
export class Order extends Base {
    @ApiProperty({
        type: String,
        description: 'Order name',
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Order status',
    })
    @Column({ enum: OrderStatus, default: OrderStatus.STARTED })
    status: OrderStatus;

    @ApiPropertyOptional({
        type: String,
        description: 'purchaseOrderId',
    })
    @IsUUID()
    @Column({ nullable: true })
    purchaseOrderId?: string;

    @ApiProperty({
        type: String,
        description: 'Vendor Id',
    })
    @IsUUID()
    @Column()
    vendorId: string;

    @ManyToOne(() => Vendor, (vendor) => vendor.order)
    @JoinColumn({ name: 'vendorId' })
    vendor: Vendor;
}
