'use client'

import { api } from '@/lib/api'
import { Button, Typography } from '@/lib/material'
import { useRouter } from 'next/navigation'

export default function Teams() {
  const { push } = useRouter()

  async function testAPI() {
    const result = await api.get('sprint')
  }

  async function onCreateTeamButton() {
    return push('teams/create-team')
  }

  return (
    <div>
      <div className="flex row justify-between mb-4">
        <Typography variant="h5" className="text-indigo-500">
          Teams list
        </Typography>

        <Button size="md" color="indigo" onClick={onCreateTeamButton}>
          Create new team
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-indigo-50 border-b">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
