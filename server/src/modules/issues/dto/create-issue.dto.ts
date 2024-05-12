import { OmitType } from '@nestjs/mapped-types';
import { Issue } from '../entities/issue.entity';

export class CreateIssueDto extends OmitType(Issue, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'project',
    'sprint',
    'hasId',
    'recover',
    'reload',
    'remove',
    'save',
    'softRemove',
]) {}
