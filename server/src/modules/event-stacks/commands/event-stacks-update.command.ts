import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { EventStacksUpdateDto } from '../dtos/event-stacks-update.dto';

export class EventStacksUpdateCommand implements EventStacksUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    status: string;

    @IsString()
    @IsOptional()
    error?: string;

    @IsJSON()
    @IsOptional()
    metadata?: string;

    constructor(data: EventStacksUpdateDto) {
        Object.assign(this, data);
    }
}
