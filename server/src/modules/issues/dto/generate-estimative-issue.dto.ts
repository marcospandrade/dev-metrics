import { Issue } from '@modules/issues/entities/issue.entity';
import { OmitType } from '@nestjs/mapped-types';
import { ORM_ENTITY_METHODS, ORM_ENTITY_TIMESTAMPS } from '@shared/helpers/orm-entity-methods';
import { IsNumber, IsOptional } from 'class-validator';

export class GenerateEstimativeIssueDto extends OmitType(Issue, [...ORM_ENTITY_METHODS, ...ORM_ENTITY_TIMESTAMPS]) {
    @IsNumber()
    @IsOptional()
    storyPoint?: number;
}
