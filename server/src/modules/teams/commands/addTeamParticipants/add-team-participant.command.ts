import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateParticipantDto } from '@modules/teams/dto/createParticipant.dto';

export class AddTeamParticipantCommand {
    @IsString()
    teamId: string;

    @ValidateNested()
    @Type(() => CreateParticipantDto)
    @IsOptional()
    participants: CreateParticipantDto[];
}
