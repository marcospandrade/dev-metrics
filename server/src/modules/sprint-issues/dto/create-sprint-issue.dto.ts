import { OmitType } from '@nestjs/mapped-types';
import { SprintIssue } from '../entities/sprint-issue.entity';
import { ORM_ENTITY_METHODS, ORM_ENTITY_TIMESTAMPS } from '@shared/helpers/orm-entity-methods';

export class CreateSprintIssueDto extends OmitType(SprintIssue, [
    'id',

    ...ORM_ENTITY_METHODS,
    ...ORM_ENTITY_TIMESTAMPS,
]) { }
