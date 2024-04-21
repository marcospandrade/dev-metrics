import { EventStacks } from '../entities/event-stacks.entity';

export class EventStacksCreatedEvent extends EventStacks {
    constructor(event: EventStacks) {
        super();
        Object.assign(this, event);
    }
}
