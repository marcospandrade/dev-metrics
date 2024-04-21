import { EventStacks } from '../entities/event-stacks.entity';

export class EventStacksUpdatedEvent extends EventStacks {
    constructor(event: EventStacks) {
        super();
        Object.assign(this, event);
    }
}
