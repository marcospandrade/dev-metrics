import { CreateSprintDto } from '@modules/sprints/dtos/create-sprint.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateSprintCommand extends CreateSprintDto {}

export class CreateSprintWithoutUserCommand extends OmitType(CreateSprintDto, ['userId']) {}
