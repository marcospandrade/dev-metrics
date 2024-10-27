import { CreateSprintDto } from '@modules/sprints/dtos/create-sprint.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSprintCommand extends OmitType(CreateSprintDto, ['userId']) {
  @IsUUID()
  id: string;
}

export class UpdateSprintWithoutUserCommand extends OmitType(CreateSprintDto, ['userId', 'projectId', 'teamId']) {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  projectId?: string;

  @IsUUID()
  @IsOptional()
  teamId?: string;
}