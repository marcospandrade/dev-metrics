import { Card, CardBody, Typography } from '@/lib/material'
import { Issue } from '@/models/Issue.model'
import { Project } from '@/models/Project.model'
import { Divider } from '@mui/material'

interface FourthStepProps {
  project: Project
  selectedIssues: Issue[]
  sprintName: string
  goals: string
}

export function FourthStep({ project, selectedIssues, sprintName, goals }: Readonly<FourthStepProps>) {
  return (
    <Card className="flex flex-1">
      <CardBody>
        <Typography variant="h5">Confirmation</Typography>
        <Typography variant="paragraph">Please review the information before creating the sprint</Typography>
        <Divider className="my-4" />

        <div className="mt-4">
          <div className=''>
            <div className="flex flex-col mt-4">
              <Typography variant="h6">Sprint name</Typography>
              <Typography variant="paragraph">{sprintName}</Typography>
            </div>
            <div className="flex flex-col mt-4">
              <Typography variant="h6">Goals</Typography>
              <Typography variant="paragraph">{goals}</Typography>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <Typography variant="h6">Project</Typography>
            <Typography variant="paragraph">
              {project.name} - {project.key}
            </Typography>
          </div>

          <div className="flex flex-col mt-4">
            <Typography variant="h6">Selected Issues: </Typography>
            <Typography variant="paragraph">
              {selectedIssues.map((issue) => (
                <div key={issue.id}>
                  <b>{issue.jiraIssueKey}</b> - {issue.summary}
                </div>
              ))}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
