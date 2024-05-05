import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { AtlassianFactoryService } from './atlassian-factory.service';
import { IAccessibleResources } from '../types/accessible-resources.model';
import { GetSpecificIssueDTO } from '../dto/get-specific-issue.dto';
import { ValidateSchema } from '@core/decorators/validate-schema';

@Injectable()
export class AtlassianUseCases {
    private readonly logger = new Logger(AtlassianUseCases.name);

    public constructor(private readonly _atlassianFactoryService: AtlassianFactoryService) {}

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

    public async getAccessibleResources(userEmail: string) {
        if (!userEmail) {
            throw new NotFoundException('Missing user id');
        }

        this.logger.log(`Getting accessible resources for ${userEmail}`);

        return this._atlassianFactoryService.genericAtlassianCall<IAccessibleResources>(
            'https://api.atlassian.com/oauth/token/accessible-resources',
            userEmail,
        );
    }

    public async exchangeCodeAndUserInformation(code: string) {
        const exchangedCode = await this._atlassianFactoryService.exchangeCodeToAccessToken(code);
        const userInfo = await this._atlassianFactoryService.getUserInformation(exchangedCode.access_token);

        if (!userInfo) throw new NotFoundException('User not found');

        return { userInfo, exchangedCode };
    }
}
