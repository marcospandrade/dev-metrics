import { AxiosError } from 'axios'
import { api, GenericHttpResponse } from '../api'
import { GetSprintDto } from './dto/get-sprint.dto';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { Sprint } from '@/models/Sprint.model';

async function getPaginatedSprints(queryString: string, projectId?: string) {
  try {
    const { data } = await api.get<GenericHttpResponse<GetSprintDto>>(`/sprints`)

    return {
        data: data.response.sprints ?? '',
        count: data.response.count
      };
  } catch (error: AxiosError | any) {
    console.error(error)
    throw new Error(error.message ?? 'Error trying to get paginated sprints')
  }
}

async function createSprint(payload: CreateSprintDto){
  try {
    const { data } = await api.post<GenericHttpResponse<Sprint>>(`/sprints`, payload)

    return data.response;
  } catch (error: AxiosError | any){
    console.error(error)
    throw new Error(error.message ?? 'Error trying to create sprint')
  }
}

export default {
  getPaginatedSprints,
  createSprint
}
