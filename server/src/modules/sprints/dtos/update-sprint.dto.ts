import { OmitType } from '@nestjs/mapped-types';
import { CreateSprintDto } from './create-sprint.dto';

export class UpdateSprintDto extends OmitType(CreateSprintDto, ['userId']) {}
