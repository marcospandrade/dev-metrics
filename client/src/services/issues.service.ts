import { api, GenericHttpResponse } from './api'
import { AxiosError } from 'axios'
import { Issue } from '@/models/Issue.model'
import { GenericWithId, PaginatedData } from '@/helpers/typescript.helper'

type GetIssueDto = {
  issues: Issue[]
  count: number
}

async function getIssues(projectId: string) {
  try {
    const { data: apiData } = await api.get<GenericHttpResponse<GetIssueDto>>(`/issues/${projectId}`)

    return apiData.response
  } catch (error: AxiosError | any) {
    console.log('ERRROR', error)
    throw new Error(error.response.data ?? 'Error trying to get projects')
  }
}

async function getPaginatedIssues(projectId: string, queryString: string): Promise<PaginatedData<GenericWithId<Issue>>>{
  try {
    const { data: apiData } = await api.get<GenericHttpResponse<GetIssueDto>>(`/issues/${projectId}?${queryString}`)
    
    return {
      data: apiData.response.issues,
      count: apiData.response.count
    };
  } catch (error: AxiosError | any){
    throw new Error(error.response.data ?? 'Error trying to get projects')
  }
}

export default {
  getIssues,
  getPaginatedIssues
}
