import { Sprint } from '@/models/Sprint.model'

export class GetSprintDto {
  sprints!: Sprint[]
  count!: number
}
