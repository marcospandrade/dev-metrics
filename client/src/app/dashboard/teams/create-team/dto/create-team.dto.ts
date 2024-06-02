export class CreateParticipantDto {
  name!: string
}

export class CreateTeamDto {
  teamName!: string
  participants!: CreateParticipantDto[]
}
