import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ORM_ENTITY_METHODS, ORM_ENTITY_TIMESTAMPS } from '@shared/helpers/orm-entity-methods';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ synchronize: false })
export class Base extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        description: 'The ID',
    })
    @IsUUID()
    @Expose()
    id: string;

    @CreateDateColumn({
        type: 'timestamp',
    })
    @ApiProperty({
        type: Date,
        description: 'The create date',
    })
    @IsDate()
    @Expose()
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    @ApiPropertyOptional({
        type: Date,
        description: 'The update date',
    })
    @IsDate()
    @Expose()
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({
        type: 'timestamp',
    })
    @ApiPropertyOptional({
        type: Date,
        description: 'The deletion date',
    })
    @IsDate()
    @IsOptional()
    deletedAt?: Date;
}

export class BaseUUID extends OmitType(Base, [...ORM_ENTITY_TIMESTAMPS, ...ORM_ENTITY_METHODS] as const) {}
