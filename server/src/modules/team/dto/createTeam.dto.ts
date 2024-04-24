import { Type } from 'class-transformer';
import { CreateParticipantDto } from './createParticipant.dto';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    teamName: string;

    @ValidateNested({ each: true })
    @Type(() => CreateParticipantDto)
    @IsOptional()
    participants?: CreateParticipantDto[];
}
