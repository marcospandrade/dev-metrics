import { IsJSON, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueuePublishEventCommand {
    @IsUUID()
    eventStackId: string;

    @IsString()
    eventStacksName: string;

    @IsString()
    eventKey: string;

    @IsUUID()
    @IsOptional()
    entityId?: string;

    @IsUUID()
    @IsOptional()
    userId?: string;

    @IsJSON()
    @IsOptional()
    metadata?: string;
}
