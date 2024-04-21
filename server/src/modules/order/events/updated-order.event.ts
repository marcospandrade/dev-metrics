import { IsOptional, IsUUID } from 'class-validator';
import { Order } from '../entities/order.entity';

export class UpdatedOrderEvent extends Order {
    @IsUUID()
    eventStackId: string;

    @IsUUID()
    orderId: string;

    @IsOptional()
    @IsUUID()
    purchaseOrderId?: string;
}
