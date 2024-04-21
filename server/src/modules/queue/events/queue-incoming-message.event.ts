import { IsObject, IsString, IsUUID } from 'class-validator';

export class QueueIncomingMessageEvent {
    @IsString()
    pattern: string;

    @IsObject()
    data: { eventStackId: string; entityId: string };

    @IsString()
    eventPattern: string;

    @IsUUID()
    purchaseOrderId: string;
}
