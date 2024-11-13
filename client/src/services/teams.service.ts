import { CreateTeamDto } from '@/app/dashboard/teams/create-team/dto/create-team.dto'
import { api, GenericHttpResponse } from './api'
import { AxiosError } from 'axios'
import { CreateTeamResponseDto } from '@/app/dashboard/teams/create-team/dto/create-team-response.dto'
import { GetTeamsResponseDto } from '@/app/dashboard/teams/create-team/dto/get-teams-response.dto'

async function createTeam(teamInfo: CreateTeamDto) {
  try {
    const { data: apiData } = await api.post<GenericHttpResponse<CreateTeamResponseDto>>('team', teamInfo)

    return apiData.response
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to create team')
  }
}

async function getTeams() {
  try {
    const { data: apiData } = await api.get<GenericHttpResponse<GetTeamsResponseDto>>('team')

    return apiData.response
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to get teams')
  }
}

async function deleteTeam(teamId: string) {
  try {
    const response = await api.delete<GenericHttpResponse<void>>(`team/${teamId}`)

    return response.data
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to delete team')
  }
}

export default {
  createTeam,
  deleteTeam,
  getTeams,
}
