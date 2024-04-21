import { EventStacksStatus, EventStacksStatusEnum } from '@modules/event-stacks/entities/event-stacks.entity';
import { IsEnum, IsJSON, IsOptional, IsString, IsUUID } from 'class-validator';

export class OrderEventStackStatusUpdateEvent {
    @IsUUID()
    eventId: string;

    @IsString()
    @IsEnum(EventStacksStatusEnum)
    status: EventStacksStatus;

    @IsJSON()
    @IsOptional()
    error?: string;
}
