import { Type } from 'class-transformer';
import { CreateParticipantDto } from './createParticipant.dto';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class UpdateTeamDto {
    @IsString()
    @IsUUID()
    teamId: string;

    @IsString()
    teamName?: string;

    @ValidateNested({ each: true })
    @Type(() => CreateParticipantDto)
    @IsOptional()
    participants?: CreateParticipantDto[];
}
