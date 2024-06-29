import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Team } from '../entities/team.entity';
import { Type } from 'class-transformer';

export class GetAndCountTeamsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Team)
    teams: Team[];

    @IsNumber()
    count: number;
}
