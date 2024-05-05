import { ClassSerializerInterceptor, Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';

import { IntegrationProjectUseCases } from './use-cases/integration-project.use-cases.service';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';

@Controller('integration-project')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class IntegrationProjectController {
    constructor(private readonly integrationProjectUseCases: IntegrationProjectUseCases) {}

    @Get('/:projectId')
    checkProjectIsSynced(@Param('projectId') projectId: string) {
        return this.integrationProjectUseCases.checkProjectIsSynced(projectId);
    }

    @Get('project-tickets/:projectId')
    getProjectTickets(@Param('projectId') projectId: string, @CurrentUser() user: User) {
        return this.integrationProjectUseCases.getAllTickets(projectId, user.email);
    }

    @Get('project-tickets/:projectId/:issueId')
    getTicketById(@Param('projectId') projectId: string, @Param('issueId') issueId: string, @CurrentUser() user: User) {
        return this.integrationProjectUseCases.getIssueById(projectId, user.email, issueId);
    }
}
