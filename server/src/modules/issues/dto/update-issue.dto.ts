import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Issue } from '../entities/issue.entity';
import { ORM_ENTITY_METHODS, ORM_ENTITY_TIMESTAMPS } from '@shared/helpers/orm-entity-methods';

export class UpdateIssueDto extends PartialType(OmitType(Issue, [...ORM_ENTITY_METHODS, ...ORM_ENTITY_TIMESTAMPS])) {}
