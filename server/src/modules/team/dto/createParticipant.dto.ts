import { OmitType } from '@nestjs/mapped-types';
import { Participant } from '../entities/participant.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateParticipantDto extends OmitType(Participant, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'isActive',
    'save',
    'remove',
    'hasId',
    'recover',
    'softRemove',
    'reload',
]) {
    @IsOptional()
    @IsNumber()
    capacity?: number;

    @IsOptional()
    @IsString()
    role?: string;
}
