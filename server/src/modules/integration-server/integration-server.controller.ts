import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { IntegrationServerUseCases } from './use-cases/integration-server.use-cases.service';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { SchemaValidator } from '@core/utils';
import { GetProjectSyncStatusQuery } from './queries/get-project-sync-status/get-project-sync-status.query';
import { NotifyServerLoginEvent } from './events/notify-server-login.event';

@Controller('integration-server')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class IntegrationServerController {
    public constructor(
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
    ) {}

    @Get('/project-tickets/:projectId')
    getProjectTickets(@Param('projectId') projectId: string, @CurrentUser() user: User) {
        return this.integrationServerUseCases.getAllTickets(projectId, user.email);
    }

    @Get('/project-tickets/:projectId/:issueId')
    getTicketById(@Param('projectId') projectId: string, @Param('issueId') issueId: string, @CurrentUser() user: User) {
        return this.integrationServerUseCases.getIssueById(projectId, user.email, issueId);
    }

    @Get('/user-accessible-resources')
    getUserAccessibleResources(@CurrentUser() user: User) {
        return this.integrationServerUseCases.getUserAccessibleResources(user.email);
    }

    @Get('/projects/:serverId')
    getProjectsByServerId(@CurrentUser() user: User, @Param('serverId') serverId: string) {
        return this.integrationServerUseCases.getServerProjects(serverId, user.email);
    }

    @Get('/:projectId')
    checkProjectIsSynced(@Param('projectId') projectId: string) {
        return this.queryBus.execute(SchemaValidator.toInstance({ projectId }, GetProjectSyncStatusQuery));
    }

    // TEST Event stack
    @Post('/start-notify-server-login')
    startEventStackByNotifyingServerLogin(@Body() payload: NotifyServerLoginEvent) {
        return this.eventBus.publish(SchemaValidator.toInstance(payload, NotifyServerLoginEvent));
    }
}
