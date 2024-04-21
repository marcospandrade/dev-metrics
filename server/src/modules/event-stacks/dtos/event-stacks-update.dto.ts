import { PartialType } from '@nestjs/mapped-types';
import { EventStacks } from '../entities/event-stacks.entity';

export class EventStacksUpdateDto extends PartialType(EventStacks) {}
