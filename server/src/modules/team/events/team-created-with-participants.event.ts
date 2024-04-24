import { IsString, ValidateNested } from 'class-validator';
import { CreateParticipantDto } from '../dto/createParticipant.dto';
import { Type } from 'class-transformer';

export class TeamCreatedWithParticipantsEvent {
    @IsString()
    teamId: string;

    @ValidateNested({ each: true })
    @Type(() => CreateParticipantDto)
    participants: CreateParticipantDto[];
}
