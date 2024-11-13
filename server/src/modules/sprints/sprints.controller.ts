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
import { StartGeneratingEstimatesEvent } from './events/start-generating-estimates.event';
import { CommandBus, EventBus } from '@nestjs/cqrs';
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
import { DeleteSprintCommand } from './commands/delete-sprint/delete-sprint.command';

@Controller('sprints')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class SprintsController {
    constructor(
        private readonly sprintUseCase: SprintsUseCasesService,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
    ) {}

    @Post()
    createSprint(@Body() payload: CreateSprintWithoutUserCommand, @CurrentUser() user: User) {
        return this.commandBus.execute(
            SchemaValidator.toInstance({ ...payload, userId: user.id }, CreateSprintCommand),
        );
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

    @Post('/generate-estimates')
    generateSprintEstimatives(@Body() payload: StartGeneratingEstimatesEvent) {
        this.eventBus.publish(SchemaValidator.toInstance(payload, StartGeneratingEstimatesEvent));
        return true;
    }

    @Put(':sprintId')
    updateSprint(@Param('sprintId') sprintId: string, @Body() payload: UpdateSprintWithoutUserCommand) {
        return this.commandBus.execute(SchemaValidator.toInstance({ ...payload, id: sprintId }, UpdateSprintCommand));
    }

    @Delete('/sprint-issue/:sprintId')
    removeSprint(@Param('sprintId') sprintId: string) {
        return this.commandBus.execute(SchemaValidator.toInstance({ sprintId }, DeleteSprintCommand)).then(r => {
            return r;
        });
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
