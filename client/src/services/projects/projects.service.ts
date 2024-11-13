import { AxiosError } from 'axios'

import { Project } from '@/models/Project.model'
import { api, GenericHttpResponse } from '../api'
import { AtlassianCustomField } from './dto/get-all-custom-fields.dto'
import { RegisterCustomFieldsDto } from './dto/register-custom-fields.dto'

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

async function syncProject(projectId: string) {
  try {
    const { data } = await api.post<GenericHttpResponse<void>>(`/integration-server/re-sync-project`, {
      projectId,
    })

    return data
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to sync the project')
  }
}

async function getAllCustomFields(projectId: string) {
  try {
    const { data } = await api.get<GenericHttpResponse<AtlassianCustomField[]>>(`/integration-server/get-all-issue-fields/${projectId}`)

    return data.response
  } catch (error: AxiosError | any) {
    console.log(error)
    throw new Error(error.response.data ?? 'Error trying to get custom fields')
  }
}

async function registerCustomFields(payload: RegisterCustomFieldsDto) {
  try {
    const { data } = await api.post<GenericHttpResponse<void>>('integration-server/register-custom-fields', payload)

    return data
  } catch (error: AxiosError | any) {
    throw new Error(error.response.data ?? 'Error trying to register custom fields')
  }
}

export default {
  getProjects,
  getProjectWithDetails,
  getAllCustomFields,
  syncProject,
  registerCustomFields,
}
