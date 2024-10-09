'use client'

import { useEffect, useState } from 'react'

import { GenericWithId, PaginatedData } from '@/helpers/typescript.helper'
import { Pagination } from '@mui/material'
import { LibIcons } from '@/lib/icons'
import { useDebounce } from 'use-debounce'

export type TableFields<T extends object> = {
  fieldDefinition: keyof T
  fieldName: string
  isBold?: boolean
  isDate?: boolean
}

interface CustomTableProps<T extends object> {
  tableTitle: string
  searchInputPlaceholder?: string
  headings: string[]
  identifierTableId: string
  tableInfoFields: TableFields<T>[]
  getData: (id: string, page: number, pageSize: number, searchText: string) => Promise<PaginatedData<GenericWithId<T>>>
}
const ITEMS_PER_PAGE = 10

export function CustomTable<T extends object>({ tableTitle, searchInputPlaceholder, headings, identifierTableId, tableInfoFields, getData }: Readonly<CustomTableProps<T>>) {
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

  function updateData(){
    getData(identifierTableId, currentPage, ITEMS_PER_PAGE, debouncedText).then(result => {
        setData(result.data)
        setMaxCount(result.count)
    })
  }

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
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[300px] relative">
            <div className="relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder={searchInputPlaceholder ?? 'Search here...'}
                onChange={(e) => setSearchString(e.target.value)}
              />
              <button className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded " type="button">
                <LibIcons.SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <table className="w-full text-sm table-auto text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-indigo-50">
          <tr>
            {headings.map((head) => (
              <th scope="col" key={head} className="px-6 py-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id} className="odd:bg-white even:bg-indigo-50 border-b">
              {tableInfoFields.map((field) => (
                <td key={field.fieldDefinition as string} className="p-4">
                  <p className={`text-sm ${field.isBold ? 'font-semibold' : ''}`}>
                    {field.isDate ? formatDate(String(record[field.fieldDefinition])) : String(record[field.fieldDefinition])}
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
