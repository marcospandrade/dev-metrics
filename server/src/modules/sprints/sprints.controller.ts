import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { SprintsUseCasesService } from './use-cases/sprints.use-cases.service';
import { CreateSprintCommand, CreateSprintWithoutUserCommand } from './commands/create-sprint/create-sprint.command';
import { CommandBus } from '@nestjs/cqrs';
import { SchemaValidator } from '@core/utils';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { SprintSearch } from './helpers/sprint-search';
import {
    RemoveSprintIssuesCommand,
    RemoveSprintIssuesWithoutSprintCommand,
} from '../sprint-issues/commands/remove-sprint-issues/remove-sprint-issues.command';
import {
    CreateSprintIssuesCommand,
    CreateSprintIssueWithoutSprintCommand,
} from '@modules/sprint-issues/commands/create-sprint-issues/create-sprint-issues.command';
import { UpdateSprintCommand, UpdateSprintWithoutUserCommand } from './commands/update-sprint/update-sprint.command';

@Controller('sprints')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class SprintsController {
    constructor(
        private readonly sprintUseCase: SprintsUseCasesService,
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    createSprint(@Body() payload: CreateSprintWithoutUserCommand, @CurrentUser() user: User) {
        return this.commandBus.execute(
            SchemaValidator.toInstance({ ...payload, userId: user.id }, CreateSprintCommand),
        );
    }

    @Put(':sprintId')
    updateSprint(@Param('sprintId') sprintId: string, @Body() payload: UpdateSprintWithoutUserCommand) {
        return this.commandBus.execute(SchemaValidator.toInstance({ ...payload, id: sprintId }, UpdateSprintCommand));
    }

    @Post(':sprintId/add-issues')
    addSprintIssues(@Param('sprintId') sprintId: string, @Body() payload: CreateSprintIssueWithoutSprintCommand) {
        return this.commandBus.execute(
            SchemaValidator.toInstance(
                { issuesList: payload.issuesList.map(({ id: issueId }) => ({ sprintId, issueId })) },
                CreateSprintIssuesCommand,
            ),
        );
    }

    @Delete(':sprintId')
    removeSprintIssues(@Param('sprintId') sprintId: string, @Body() payload: RemoveSprintIssuesWithoutSprintCommand) {
        return this.commandBus
            .execute(SchemaValidator.toInstance({ ...payload, sprintId }, RemoveSprintIssuesCommand))
            .then(r => {
                return r;
            });
    }

    @Get()
    getPaginatedSprints(@Query() query: GenericQueryDto & SprintSearch, @CurrentUser() user: User) {
        return this.sprintUseCase.findAllPaginated(user.id, query);
    }

    @Get(':id')
    getSprintById(@Param('id') sprintId: string) {
        return this.sprintUseCase.findById(sprintId);
    }
}
