'use client'

import { ReactNode, useEffect, useState } from 'react'

import { GenericWithId, PaginatedData } from '@/helpers/typescript.helper'
import { Checkbox, Typography } from '@/lib/material'
import { Pagination } from '@mui/material'
import { useDebounce } from 'use-debounce'
import { SearchInput } from '../Common/SearchInput'
import { TableAction } from './TableAction'
import { colors } from '@material-tailwind/react/types/generic'

export type ActionItem = {
  label: string
  icon?: ReactNode
  color: colors
  onClick: (identifier: string) => void
}

export type TableFields<T extends object> = {
  fieldDefinition: keyof T | null
  fieldName: string
  isBold?: boolean
  isDate?: boolean
  isActions?: boolean
}

export type SearchOptions = {
  page: number
  pageSize: number
  searchText?: string
}

interface CustomTableProps<T extends object> {
  tableTitle: string
  searchInputPlaceholder?: string
  headings: string[]
  identifierTableId?: string
  tableInfoFields: TableFields<T>[]
  getData: (id?: string, searchOption?: SearchOptions) => Promise<PaginatedData<GenericWithId<T>> | undefined>
  useCheckbox?: boolean
  onSelectCheckbox?: (item: T) => void
  validateIsChecked?: (id: string) => boolean
  selectedItemsLength?: number
  actionsList?: ActionItem[]
  shouldUpdateTable?: boolean
}
const ITEMS_PER_PAGE = 10

export function CustomTable<T extends object>({
  tableTitle,
  searchInputPlaceholder,
  headings,
  identifierTableId,
  tableInfoFields,
  getData,
  useCheckbox = false,
  onSelectCheckbox,
  validateIsChecked,
  selectedItemsLength = 0,
  actionsList,
  shouldUpdateTable = false
}: Readonly<CustomTableProps<T>>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<GenericWithId<T>[] | null>(null)
  const [maxCount, setMaxCount] = useState<number>(0)
  const [searchString, setSearchString] = useState('')
  const [debouncedText] = useDebounce(searchString, 500)

  const numberOfPages = Math.ceil(maxCount / ITEMS_PER_PAGE)

  function changePage(page: number) {
    setCurrentPage(page)
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-br', { dateStyle: 'medium' }).format(new Date(date))
  }

  function updateData() {
    getData(identifierTableId, { page: currentPage, pageSize: ITEMS_PER_PAGE, searchText: debouncedText }).then((result) => {
      if (!result) return

      setData(result.data)
      setMaxCount(result.count)
    })
  }

  useEffect(() => {
    console.log('should update', shouldUpdateTable)
    updateData()
  }, [shouldUpdateTable])

  useEffect(() => {
    updateData()
  }, [identifierTableId, currentPage, debouncedText])

  if (!data) {
    return <h2 className="font-bold text-indigo-800">Not to show</h2>
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center mb-3 mt-1 px-3 py-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{tableTitle}</h3>
          {useCheckbox && selectedItemsLength > 0 && <Typography variant="paragraph"> Selected ({selectedItemsLength})</Typography>}
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[300px] relative">
            <SearchInput searchInputPlaceholder={searchInputPlaceholder ?? 'Search here...'} onChangeSearchInput={setSearchString} />
          </div>
        </div>
      </div>
      <table className="w-full text-sm table-auto text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-indigo-50">
          <tr>
            {useCheckbox && <th scope="col" className="px-6 py-3"></th>}
            {headings.map((head) => (
              <th scope="col" key={head} className="px-6 py-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <td colSpan={tableInfoFields.length}>
              <Typography className="flex justify-center text-black mt-6" variant='h5'> No data to show </Typography>
            </td>
          )}
          {data.map((record) => (
            <tr key={record.id} className="odd:bg-white even:bg-indigo-50 border-b">
              {useCheckbox && onSelectCheckbox && validateIsChecked && (
                <td className="p-4">
                  <Checkbox onClick={() => onSelectCheckbox(record)} defaultChecked={validateIsChecked(record.id)} />
                </td>
              )}
              {tableInfoFields.map((field) => (
                <td key={field.fieldDefinition as string} className="p-4">
                  <p className={`text-sm flex flex-row ${field.isBold ? 'font-semibold' : ''}`}>
                    {field.isActions && !!actionsList
                      ? actionsList.map((actionItemConfig) => <TableAction key={actionItemConfig.label} identifier={record.id} actionItemConfig={actionItemConfig} />)
                      : field.isDate
                        ? formatDate(String(record[field.fieldDefinition!]))
                        : String(record[field.fieldDefinition!])}
                  </p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full flex flex-row items-center p-5">
        <Pagination count={numberOfPages} onChange={(ev, page) => changePage(page)} />
      </div>
    </div>
  )
}
