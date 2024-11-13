type IssueId = {
  id: string
}

export class CreateSprintDto {
  name!: string
  goals!: string
  startDate!: Date
  endDate!: Date
  teamId!: string
  projectId!: string
  issuesList!: IssueId[]
}
