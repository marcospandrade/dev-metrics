import { OmitType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { ORM_ENTITY_METHODS, ORM_ENTITY_TIMESTAMPS } from '@shared/helpers/orm-entity-methods';
import { BaseUUID } from '@core/database/entities/base.entity';

const FIELDS_TO_OMIT = ['id', 'issuesList', 'user', 'team', ...ORM_ENTITY_METHODS, ...ORM_ENTITY_TIMESTAMPS] as const;
export class CreateSprintDto extends OmitType(Sprint, FIELDS_TO_OMIT) {
  @IsArray()
  @Type(() => BaseUUID)
  @ValidateNested({ each: true })
  @IsOptional()
  issuesList?: BaseUUID[];
}
