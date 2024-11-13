'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button, Typography } from '@/lib/material'
import { Team } from '@/models/Team.model'
import teamsService from '@/services/teams.service'
import { LibIcons } from '@/lib/icons'
import { useModal } from '@/hooks/useModal'

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [count, setCount] = useState<number>(0)
  const { defineModal, handleModal } = useModal()

  const { push } = useRouter()

  async function fetchTeams() {
    const getTeamsResponse = await teamsService.getTeams()
    setTeams(getTeamsResponse.teams)
    setCount(getTeamsResponse.count)
  }

  async function onDeleteTeamButton(teamId: string) {
    defineModal({
      title: 'Delete Team',
      text: 'Are you sure you want to delete a team?',
      handleConfirm: () => handleDeleteTeam(teamId),
    })
  }

  async function handleDeleteTeam(teamId: string) {
    const responseDeleteTeam = await teamsService.deleteTeam(teamId)
    handleModal(false)
    // if(responseDeleteTeam.status)
    return fetchTeams()
  }

  async function onCreateTeamButton() {
    return push('teams/create-team')
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return (
    <div>
      <div className="flex row justify-between mb-4">
        <Typography variant="h5" className="text-indigo-500">
          Teams list ({count})
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
                id
              </th>
              <th scope="col" className="px-6 py-3">
                Team Name
              </th>
              <th scope="col" className="px-6 py-3">
                Participants
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr className="odd:bg-white even:bg-indigo-50 border-b" key={team.id}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {team.id}
                </th>
                <td className="px-6 py-4">{team.teamName}</td>
                <td className="px-6 py-4">{team.participants.map((participant) => participant.name).join(', ')}</td>
                <td className="px-6 py-4 text-center">
                  {/* NOTE: Implement edit behavior */}
                  {/* <Button size='sm' className="font-medium text-green-600 bg-transparent drop-shadow-lg hover:underline p-2">
                    <LibIcons.EditIcon />
                  </Button> */}
                  <Button
                    size="sm"
                    className="font-medium text-red-600 bg-transparent drop-shadow-lg hover:underline p-2"
                    onClick={() => onDeleteTeamButton(team.id)}
                  >
                    <LibIcons.DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
