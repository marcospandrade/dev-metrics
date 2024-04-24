import { CreateTeamDto } from '@modules/team/dto/createTeam.dto';
import { IsString } from 'class-validator';

export class CreateTeamCommand extends CreateTeamDto {
    @IsString()
    userId: string;
}
