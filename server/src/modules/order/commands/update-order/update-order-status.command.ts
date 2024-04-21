import { IsObject, IsString, IsUUID } from 'class-validator';

export class UpdateOrderCommand {
    @IsString()
    pattern: string;

    //TODO: improve typing
    @IsObject()
    data: { eventStackId: string; entityId: string };

    @IsString()
    eventPattern: string;

    @IsUUID()
    purchaseOrderId: string;
}
