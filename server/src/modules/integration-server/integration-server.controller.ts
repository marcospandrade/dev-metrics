import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventBus, QueryBus } from '@nestjs/cqrs';

import { IntegrationServerUseCases } from './use-cases/integration-server.use-cases.service';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { SchemaValidator } from '@core/utils';
import { GetProjectSyncStatusQuery } from './queries/get-project-sync-status/get-project-sync-status.query';
import { NotifyServerLoginEvent } from './events/notify-server-login.event';
import { QueryIssues } from '@lib/atlassian/types/issues.type';
import { ProjectUseCases } from './use-cases/projects.use-cases.service';
import { SearchFieldByNameDto } from '@lib/atlassian/dto/search-field-by-name.dto';
import { GetAllIssuesFieldsQuery } from './queries/get-all-issues-fields/get-all-issues-fields.query';
import { IUser } from '@modules/auth/dto/user.dto';

@Controller('integration-server')
@UseGuards(JwtAuthGuard)
export class IntegrationServerController {
    public constructor(
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly projectsUseCases: ProjectUseCases,
    ) { }

    @Get('/project-tickets/:projectId')
    getProjectTickets(@Param('projectId') projectId: string, @CurrentUser() user: User) {
        const query: QueryIssues = {
            startAt: 50,
            maxResults: 100,
            jql: 'project=ED',
            fields: ['description', 'summary', 'customfield_10016'],
        };
        return this.integrationServerUseCases.getAllTickets(projectId, user.email, query);
    }

    @Get('external/project-tickets/:externalProjectId/:issueId')
    getTicketById(
        @Param('externalProjectId') projectId: string,
        @Param('issueId') issueId: string,
        @CurrentUser() user: User,
    ) {
        return this.integrationServerUseCases.getIssueById(projectId, user.email, issueId);
    }

    @Get('/user-accessible-resources')
    getUserAccessibleResources(@CurrentUser() user: User) {
        return this.integrationServerUseCases.getUserAccessibleResources(user.email);
    }

    @Get('external/projects/:serverId')
    getExternalProjectsByServerId(@CurrentUser() user: User, @Param('serverId') serverId: string) {
        return this.integrationServerUseCases.getServerProjects(serverId, user.email);
    }

    @Get('/projects/:integrationServerId')
    getInternalProjectsByServerId(
        @CurrentUser() user: User,
        @Param('integrationServerId') integrationServerId: string,
    ) {
        return this.projectsUseCases.findProjectsByJiraId(integrationServerId, user.email);
    }

    @Get('search-field/:cloudId/:fieldName')
    searchFieldByName(
        @Param('cloudId') cloudId: string,
        @Param('fieldName') fieldName: string,
        @CurrentUser() user: User,
    ) {
        return this.integrationServerUseCases.searchFieldIdByName(
            SchemaValidator.toInstance({ cloudId, userEmail: user.email, fieldName }, SearchFieldByNameDto),
        );
    }

    @Get('/:projectId')
    checkProjectIsSynced(@Param('projectId') projectId: string) {
        return this.queryBus.execute(SchemaValidator.toInstance({ projectId }, GetProjectSyncStatusQuery));
    }

    @Get('/get-all-issue-fields/:projectId')
    getAllIssueFields(@Param('projectId') projectId: string, @CurrentUser() user: IUser) {
        return this.queryBus.execute(SchemaValidator.toInstance({ projectId, userEmail: user.email }, GetAllIssuesFieldsQuery));
    }

    // TEST Event stack
    @Post('/start-notify-server-login')
    startEventStackByNotifyingServerLogin(@Body() payload: NotifyServerLoginEvent) {
        return this.eventBus.publish(SchemaValidator.toInstance(payload, NotifyServerLoginEvent));
    }
}
