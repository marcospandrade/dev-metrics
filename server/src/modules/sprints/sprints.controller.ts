import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { SprintsUseCasesService } from './use-cases/sprints.use-cases.service';
import { CreateSprintCommand, CreateSprintWithoutUserCommand } from './commands/create-sprint/create-sprint.command';
import { CommandBus } from '@nestjs/cqrs';
import { SchemaValidator } from '@core/utils';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { SprintSearch } from './helpers/sprint-search';
import { AddSprintIssuesCommand, AddSprintIssuesWithoutSprintCommand } from './commands/add-sprint-issues/add-sprint-issues.command';
import { RemoveSprintIssuesCommand, RemoveSprintIssuesWithoutSprintCommand } from './commands/remove-sprint-issues/remove-sprint-issues.command';

@Controller('sprints')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class SprintsController {
  constructor(
    private readonly sprintUseCase: SprintsUseCasesService,
    private readonly commandBus: CommandBus
  ) { }

  @Post()
  createSprint(@Body() payload: CreateSprintWithoutUserCommand, @CurrentUser() user: User) {
    return this.commandBus.execute(SchemaValidator.toInstance(
      { ...payload, userId: user.id },
      CreateSprintCommand
    ))
  }

  @Post(':sprintId/add-issues')
  addSprintIssues(@Param('sprintId') sprintId: string, @Body() payload: AddSprintIssuesWithoutSprintCommand) {
    return this.commandBus.execute(SchemaValidator.toInstance(
      { ...payload, sprintId },
      AddSprintIssuesCommand
    ))
  }

  @Post(':sprintId/remove-issues')
  removeSprintIssues(@Param('sprintId') sprintId: string, @Body() payload: RemoveSprintIssuesWithoutSprintCommand) {
    return this.commandBus.execute(SchemaValidator.toInstance(
      { ...payload, sprintId },
      RemoveSprintIssuesCommand
    ))
  }

  @Get()
  getPaginatedSprints(
    @Query() query: GenericQueryDto & SprintSearch,
    @CurrentUser() user: User
  ) {
    return this.sprintUseCase.findAllPaginated(user.id, query);
  }

  @Get(':id')
  getSprintById(@Param('id') sprintId) {
    return this.sprintUseCase.findById(sprintId);
  }
}
