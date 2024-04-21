import { Base } from '@core/database/entities/base.entity';
import { IsDate, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const EventStacksStatusEnum = {
    CREATED: 'CREATED',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    FAILED: 'FAILED',
    COMPLETED: 'COMPLETED',
} as const;

export type EventStacksStatus = (typeof EventStacksStatusEnum)[keyof typeof EventStacksStatusEnum];

@Entity({ name: 'event_stacks' })
export class EventStacks extends Base {
    @PrimaryGeneratedColumn('uuid')
    @IsString()
    id: string;

    @Column({ nullable: false })
    @IsString()
    eventName: string;

    @Column({ nullable: false })
    @IsString()
    eventKey: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    entityId?: string;

    @Column({ nullable: true })
    @IsJSON()
    @IsOptional()
    metadata?: string;

    @Column({
        nullable: false,
        default: EventStacksStatusEnum.CREATED,
        enum: EventStacksStatusEnum,
    })
    @IsEnum(['CREATED', 'PENDING', 'FAILED', 'COMPLETED'])
    status: string;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    startedAt?: Date;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    completedAt?: Date;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    errorAt?: Date;

    @Column({ nullable: true, type: 'text' })
    @IsString()
    @IsOptional()
    error?: string;
}
