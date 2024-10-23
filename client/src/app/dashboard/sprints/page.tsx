'use client'

import querystring from 'querystring'
import { CustomTable, SearchOptions } from '@/components/CustomTable/CustomTable'

import sprintsService from '@/services/sprints/sprints.service'
import { SPRINTS_TABLE_DEFINITIONS, SPRINTS_TABLE_HEADINGS } from './constants/sprints-table'
import { useAuth } from '@/hooks/useAuth'

export default function Sprints() {
  const { user } = useAuth()
  async function fetchSprints(userEmail?: string, searchObject?: SearchOptions) {
    const searchObjects = {
      page: searchObject?.page,
      pageSize: searchObject?.pageSize,
      searchText: searchObject?.searchText ?? '',
    }

    const searchString = querystring.stringify(searchObjects)
    return sprintsService.getPaginatedSprints(searchString, userEmail)
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-indigo-100">
      <CustomTable
        tableTitle="List of Issues"
        searchInputPlaceholder="Search for issues or key here..."
        getData={fetchSprints}
        headings={SPRINTS_TABLE_HEADINGS}
        tableInfoFields={SPRINTS_TABLE_DEFINITIONS}
        identifierTableId={user?.email}
      ></CustomTable>
    </div>
  )
}
