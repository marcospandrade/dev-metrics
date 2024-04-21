import { Injectable } from '@nestjs/common';

import { EventStacks } from './entities/event-stacks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class EventStacksService {
    public constructor(
        @InjectRepository(EventStacks) private readonly eventStacksRepository: Repository<EventStacks>,
    ) {}

    async create(eventStack: Partial<Omit<EventStacks, 'id'>>) {
        return this.eventStacksRepository.save(eventStack);
    }

    async findAll(opts?: FindManyOptions<EventStacks>) {
        return this.eventStacksRepository.find(opts);
    }

    async findOne(opts?: FindManyOptions<EventStacks>) {
        return this.eventStacksRepository.findOne(opts);
    }

    async remove(id: string): Promise<void> {
        await this.eventStacksRepository.delete(id);
    }

    async update(eventStack: Partial<EventStacks> & { id: string }) {
        return this.eventStacksRepository.save(eventStack);
    }
}
