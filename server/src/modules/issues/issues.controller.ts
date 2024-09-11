import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { IssueUseCases } from './use-cases/issues.use-cases.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IUser } from '@modules/auth/dto/user.dto';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { GenericQueryDto } from '@shared/helpers/pagination/query';

export interface IssueSearch {
    jiraIssueKey?: string;
    summary?: string;
}

@Controller('issues')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class IssuesController {
    public constructor(private readonly issueUseCases: IssueUseCases) {}

    @Get('/:projectId')
    getAll(
        @Query() query: GenericQueryDto & IssueSearch,
        @Param('projectId') projectId: string,
        @CurrentUser() user: IUser,
    ) {
        return this.issueUseCases.findTicketsByProject(projectId, user.id, query);
    }

    @Post('/upsert')
    upsertTicket(@Body() payload: CreateIssueDto) {
        return this.issueUseCases.upsertMany([payload]);
    }
}
