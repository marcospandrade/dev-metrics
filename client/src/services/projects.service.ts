import { AxiosError } from 'axios'

import { Project } from '@/models/Project.model'
import { api, GenericHttpResponse } from './api'

async function getProjects(integrationServerId: string) {
  try {
    const { data: apiData } = await api.get<GenericHttpResponse<Project[]>>(`/integration-server/projects/${integrationServerId}`)

    return apiData.response
  } catch (error: AxiosError | any) {
    console.log('ERRROR', error)
    throw new Error(error.response.data ?? 'Error trying to get projects')
  }
}

async function getProjectWithDetails(projectId: string) {
  try {
    const { data: apiData } = await api.get<GenericHttpResponse<Project[]>>(`/projects/${projectId}`)

    return apiData.response[0]
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to get the project')
  }
}

async function syncProject(projectId: string){
  return;
  try {
    const { data } = await api.post<GenericHttpResponse<any>>(`/projects/${projectId}/sync`)

    return data
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to sync the project')
  }
}

export default {
  getProjects,
  getProjectWithDetails,
  syncProject
}
