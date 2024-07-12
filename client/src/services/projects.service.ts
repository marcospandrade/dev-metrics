import { Project } from "@/models/Project.model";
import { api, GenericHttpResponse } from "./api";
import { AxiosError } from "axios";

async function getProjects(projectId: string){
    try {
        const { data: apiData } = await api.get<GenericHttpResponse<Project[]>>(`/integration-server/projects/${projectId}`);

        return apiData.response
    } catch (error: AxiosError | any) {
        console.log("ERRROR", error)
        throw new Error(error.response.data ?? 'Error trying to get projects')
    }
}

export default {
    getProjects
}