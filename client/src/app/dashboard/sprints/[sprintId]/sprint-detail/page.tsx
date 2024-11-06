'use client'

import { Sprint } from '@/models/Sprint.model'
import sprintsService from '@/services/sprints/sprints.service'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody, Typography } from '@/lib/material'
import { ItemDetail } from './ItemDetail'
import { Divider } from '@mui/material'
import { SprintIssueList } from './SprintIssueList'

export default function SprintDetails() {
  const { sprintId } = useParams<{ sprintId: string }>()
  const [sprintDetails, setSprintDetails] = useState<Sprint | undefined>(undefined)

  async function fetchSprintDetails() {
    return sprintsService.getSprintById(sprintId)
  }

  useEffect(() => {
    fetchSprintDetails().then((response) => setSprintDetails(response))
  }, [sprintId])

  if (!sprintDetails)
    return (
      <div className="flex flex-1 max-w-full animate-pulse">
        <Typography as="div" variant="h1" className="mb-4 mt-6 h-80 w-full rounded-md bg-gray-300">
          &nbsp;
        </Typography>
      </div>
    )

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex flex-col mb-4 gap-y-4">
            <ItemDetail title={'Sprint name'} text={sprintDetails.name} />
            <ItemDetail title={'Goals'} text={sprintDetails.goals} />
          </div>
          
          <Divider />
          
          <div className='mt-4'>
            <Typography variant='h5' className='mb-6'>Selected issues</Typography>
            <SprintIssueList sprintIssues={sprintDetails.issuesList} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
