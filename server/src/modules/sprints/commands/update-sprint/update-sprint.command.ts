import { CreateSprintDto } from '@modules/sprints/dtos/create-sprint.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSprintCommand extends OmitType(CreateSprintDto, ['userId']) {
  @IsUUID()
  id: string;
}

export class UpdateSprintWithoutUserCommand extends OmitType(CreateSprintDto, ['userId']) {
  @IsUUID()
  @IsOptional()
  id?: string;
}