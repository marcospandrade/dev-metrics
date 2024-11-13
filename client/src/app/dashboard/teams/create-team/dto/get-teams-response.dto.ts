import { Team } from '@/models/Team.model';

export class GetTeamsResponseDto {
  teams!: Team[];
  count!: number;
}
