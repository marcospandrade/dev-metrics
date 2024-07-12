import { api, GenericHttpResponse } from "./api";
import { AxiosError } from "axios";
import { Issue } from "@/models/Issue.model";

type GetIssueDto = {
    issues: Issue[],
    count: number;
}

async function getIssues(projectId: string){
    try {
        const { data: apiData } = await api.get<GenericHttpResponse<GetIssueDto>>(`/issues/${projectId}`);

        return apiData.response
    } catch (error: AxiosError | any) {
        console.log("ERRROR", error)
        throw new Error(error.response.data ?? 'Error trying to get projects')
    }
}

export default {
    getIssues
}