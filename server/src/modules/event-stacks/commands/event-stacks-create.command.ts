import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { EventStacksCreateDto } from '../dtos/event-stacks-create.dto';

export class EventStacksCreateCommand implements EventStacksCreateDto {
    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    eventKey: string;

    @IsString()
    @IsOptional()
    entityId?: string;

    @IsString()
    @IsOptional()
    userId?: string;

    @IsJSON()
    @IsOptional()
    metadata?: string;
}
