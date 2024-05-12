import { OmitType } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

export class CreateProjectDto extends OmitType(Project, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'integrationServer',
    'hasId',
    'save',
    'remove',
    'softRemove',
    'recover',
    'reload',
]) {}
