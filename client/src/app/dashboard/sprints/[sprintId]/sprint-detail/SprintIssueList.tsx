import { Issue } from '@/models/Issue.model'
import { SprintIssue } from '@/models/SprintIssue.model'
import { Typography } from '@material-tailwind/react'

interface SprintIssueListProps {
  sprintIssues?: SprintIssue[]
}

const TABLE_HEAD = ['Jira Key', 'Issue', 'Story Point', 'Suggested Estimate']

export function SprintIssueList({ sprintIssues }: Readonly<SprintIssueListProps>) {
  function extractStoryPointField(issue: Issue){
    const storyPointField = issue.project.customFields.find(customField => Boolean(customField.isStoryPointField))
    return storyPointField?.name
  }

  if (!sprintIssues) return null

  return (
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-bold leading-none opacity-70">
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sprintIssues.map((sprintIssue) => (
          <tr className="hover:bg-gray-50" key={sprintIssue.id}>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="flex items-center gap-2 font-normal leading-none opacity-70">
                {sprintIssue.issue.jiraIssueKey}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="flex items-center gap-2 font-normal leading-none opacity-70">
                {sprintIssue.issue.summary}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="flex items-center gap-2 font-normal leading-none opacity-70">
                {sprintIssue.issue.customFields?.[extractStoryPointField(sprintIssue.issue) ?? ''] ?? 'N/A'}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="flex items-center gap-2 font-normal leading-none opacity-70">
                {sprintIssue.issue.estimatedStoryPoints ?? 'Not generated'}
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
