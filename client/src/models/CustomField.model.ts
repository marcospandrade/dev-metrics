export type CustomField = {
  id: string
  createdAt: string
  updatedAt: string
  atlassianId: string
  name: string
  type: 'array' | 'string' | 'number' | 'boolean'
  isStoryPointField: boolean
  projectId: string
}
