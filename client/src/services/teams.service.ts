import { CreateTeamDto } from '@/app/dashboard/teams/create-team/dto/create-team.dto'
import { api, GenericHttpResponse } from './api'
import { AxiosError } from 'axios'
import { CreateTeamResponseDto } from '@/app/dashboard/teams/create-team/dto/create-team-response.dto'
import { Team } from '@/models/Team.model'
import { GetTeamsResponseDto } from '@/app/dashboard/teams/create-team/dto/get-teams-response.dto'

async function createTeam(teamInfo: CreateTeamDto) {
  try {
    const { data: apiData } = await api.post<GenericHttpResponse<CreateTeamResponseDto>>('team', teamInfo)

    return apiData.response
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to get projects')
  }
}

async function getTeams(){
    try {
        const { data: apiData } = await api.get<GenericHttpResponse<GetTeamsResponseDto>>('team')
    
        return apiData.response
    } catch (error: AxiosError | any) {
        throw new Error(error.response.data ?? 'Error trying to get projects')
    }
}

export default {
  createTeam,
  getTeams
}
