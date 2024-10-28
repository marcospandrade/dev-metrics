'use client'

import querystring from 'querystring'
import { CustomTable, SearchOptions } from '@/components/CustomTable/CustomTable'
import { Button, Card, CardBody, Typography } from '@/lib/material'

import sprintsService from '@/services/sprints/sprints.service'
import { SPRINTS_TABLE_DEFINITIONS, SPRINTS_TABLE_HEADINGS } from './constants/sprints-table'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Sprints() {
  const { user } = useAuth()
  const router = useRouter()
  async function fetchSprints(userEmail?: string, searchObject?: SearchOptions) {
    const searchObjects = {
      page: searchObject?.page,
      pageSize: searchObject?.pageSize,
      searchText: searchObject?.searchText ?? '',
    }

    const searchString = querystring.stringify(searchObjects)
    return sprintsService.getPaginatedSprints(searchString, userEmail)
  }

  function onCreateSprint(){
    router.push('/dashboard/sprints/create-sprint')
  }

  return (
    <div>
      <Card className="my-8">
        <CardBody className="flex flex-1 justify-between">
          <div>
            <Typography variant="h5">Sprints</Typography>
            <Typography variant="paragraph">Here you can select a sprint to check the details and after generate estimates for it</Typography>
          </div>
          <div>
            <Button color="indigo" onClick={onCreateSprint}> Create new sprint </Button>
          </div>
        </CardBody>
      </Card>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-indigo-100">
        <CustomTable
          tableTitle="List of Sprints"
          searchInputPlaceholder="Search for issues or key here..."
          getData={fetchSprints}
          headings={SPRINTS_TABLE_HEADINGS}
          tableInfoFields={SPRINTS_TABLE_DEFINITIONS}
          identifierTableId={user?.email}
        ></CustomTable>
      </div>
    </div>
  )
}
