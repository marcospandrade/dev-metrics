import { TableFields } from "@/components/CustomTable/CustomTable"
import { Issue } from "@/models/Issue.model"
import { Sprint } from "@/models/Sprint.model"

export const SPRINTS_TABLE_HEADINGS: string[] = ['Sprint Name', 'Goals']
export const SPRINTS_TABLE_DEFINITIONS: TableFields<Sprint>[] = [
  {
    fieldDefinition: "name",
    fieldName: 'Sprint Name',
    isBold: true,
  },
  {
    fieldDefinition: "goals",
    fieldName: 'Goals',
  }
]