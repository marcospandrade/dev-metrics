import { AxiosError } from 'axios'
import { api, GenericHttpResponse } from '../api'
import { GetSprintDto } from './dto/get-sprint.dto';

async function getPaginatedSprints(queryString: string, projectId?: string) {
  try {
    const { data } = await api.get<GenericHttpResponse<GetSprintDto>>(`//${projectId}?${queryString}`)

    return {
        data: data.response.sprints ?? '',
        count: data.response.count
      };
  } catch (error: AxiosError | any) {
    console.error(error)
    throw new Error(error.message ?? 'Error trying to get paginated sprints')
  }
}

export default {
  getPaginatedSprints,
}
