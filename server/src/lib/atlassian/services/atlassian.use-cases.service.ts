import { Injectable, NotFoundException } from '@nestjs/common';

import { AtlassianFactoryService } from './atlassian-factory.service';
import { TAccessibleResources } from '../types/accessible-resources.type';
import { GetSpecificIssueDTO } from '../dto/get-specific-issue.dto';
import { ValidateSchema } from '@core/decorators/validate-schema';
import { GetAccessibleResourcesDTO } from '../dto/get-accessible-resources.dto';
import { GetPaginatedProjectsDTO } from '../dto/get-paginated-projects.dto';
import { LoggerService } from '@core/logger/logger.service';
import { generateBasicAtlassianUrl } from '../helpers/constants';
import { AtlassianProject, PaginatedResponse } from '../types/atlassian-project.type';

@Injectable()
export class AtlassianUseCases {
    public constructor(
        private readonly logger: LoggerService,
        private readonly _atlassianFactoryService: AtlassianFactoryService,
    ) {}

    public async getIssues(cloudId: string, userEmail: string, query?: string) {
        const urlGetIssues = !!query
            ? `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?${query}`
            : `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

        return this._atlassianFactoryService.genericAtlassianCall(urlGetIssues, userEmail);
    }

    @ValidateSchema(GetSpecificIssueDTO)
    public async getSpecificIssue(payload: GetSpecificIssueDTO) {
        const getIssueUrl = !!payload?.query
            ? `https://api.atlassian.com/ex/jira/${payload.cloudId}/rest/api/3/issue/${payload.issueId}?${payload.query}`
            : `https://api.atlassian.com/ex/jira/${payload.cloudId}/rest/api/3/issue/${payload.issueId}`;

        return this._atlassianFactoryService.genericAtlassianCall(getIssueUrl, payload.userEmail);
    }

    @ValidateSchema(GetAccessibleResourcesDTO)
    public async getAccessibleResources(payload: GetAccessibleResourcesDTO) {
        this.logger.info(`Getting accessible resources for ${payload.userEmail}`);

        return this._atlassianFactoryService.genericAtlassianCall<TAccessibleResources>(
            'https://api.atlassian.com/oauth/token/accessible-resources',
            payload.userEmail,
        );
    }

    public async exchangeCodeAndUserInformation(code: string) {
        const exchangedCode = await this._atlassianFactoryService.exchangeCodeToAccessToken(code);
        const userInfo = await this._atlassianFactoryService.getUserInformation(exchangedCode.access_token);

        if (!userInfo) throw new NotFoundException('User not found');

        return { userInfo, exchangedCode };
    }

    @ValidateSchema(GetPaginatedProjectsDTO)
    public async getPaginatedProjects(payload: GetPaginatedProjectsDTO) {
        const urlGetProjects = `${generateBasicAtlassianUrl(payload.cloudId)}/project/search?action=view`;

        this.logger.info({ getUrl: urlGetProjects }, 'Getting paginated projects');

        return this._atlassianFactoryService.genericAtlassianCall<PaginatedResponse<AtlassianProject>>(
            urlGetProjects,
            payload.userEmail,
        );
    }
}
