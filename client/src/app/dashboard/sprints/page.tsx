'use client'

import querystring from 'querystring'
import { ActionItem, CustomTable, SearchOptions } from '@/components/CustomTable/CustomTable'
import { Button, Card, CardBody, Typography } from '@/lib/material'

import sprintsService from '@/services/sprints/sprints.service'
import { SPRINTS_TABLE_DEFINITIONS, SPRINTS_TABLE_HEADINGS } from './constants/sprints-table'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LibIcons } from '@/lib/icons'
import { useModal } from '@/hooks/useModal'
import { toast } from 'react-toastify'
import { use, useState } from 'react'

export default function Sprints() {
  const { user } = useAuth()
  const { defineModal, handleModal } = useModal()
  const router = useRouter()
  const [shouldUpdateTable, setShouldUpdateTable] = useState(false)

  const actionsList: ActionItem[] = [
    {
      label: 'Details',
      icon: <LibIcons.InfoIcon />,
      color: 'indigo',
      onClick: (identifier: string) => router.push(`/dashboard/sprints/${identifier}/sprint-detail`),
    },
    {
      label: 'Delete',
      color: 'deep-orange',
      icon: <LibIcons.DeleteIcon />,
      onClick: (identifier) => onDeleteSprint(identifier),
    },
  ]

  async function onDeleteSprint(sprintId: string) {
    return defineModal({
      title: 'Delete Sprint',
      text: 'Are you sure you want to delete this sprint?',
      handleConfirm: () => handleDeleteSprint(sprintId),
      buttonConfirmText: 'Delete',
    })
  }
  
  async function handleDeleteSprint(sprintId: string) {
    handleModal(false)
    await sprintsService.deleteSprint(sprintId)
    setShouldUpdateTable(!shouldUpdateTable)
    toast.success('Sprint deleted successfully')
  }

  function generateSearchString(page?: number, pageSize?: number, searchText?: string) {
    return querystring.stringify({
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      searchText: searchText ?? '',
    })
  }

  async function fetchSprints(userEmail?: string, searchObject?: SearchOptions) {
    const searchString = generateSearchString(searchObject?.page, searchObject?.pageSize, searchObject?.searchText) 
    return sprintsService.getPaginatedSprints(searchString, userEmail)
  }

  function onCreateSprint() {
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
            <Button color="indigo" onClick={onCreateSprint}>
              Create new sprint
            </Button>
          </div>
        </CardBody>
      </Card>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-indigo-100">
        <CustomTable
          tableTitle="List of Sprints"
          searchInputPlaceholder="Search for sprint here..."
          getData={fetchSprints}
          headings={SPRINTS_TABLE_HEADINGS}
          tableInfoFields={SPRINTS_TABLE_DEFINITIONS}
          identifierTableId={user?.email}
          actionsList={actionsList}
          shouldUpdateTable={shouldUpdateTable}
        ></CustomTable>
      </div>
    </div>
  )
}
