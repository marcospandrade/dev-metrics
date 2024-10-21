import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintsController } from './sprints.controller';
import { SprintsUseCasesService } from './use-cases/sprints.use-cases.service';
import { Sprint } from './entities/sprint.entity';
import { CreateSprintCommandHandler } from './commands/create-sprint/create-sprint.handler';
import { AddSprintIssuesCommandHandler } from './commands/add-sprint-issues/add-sprint-issues.handler';
import { RemoveSprintIssuesCommandHandler } from './commands/remove-sprint-issues/remove-sprint-issues.handler';

const CommandHandlers = [
  CreateSprintCommandHandler,
  AddSprintIssuesCommandHandler,
  RemoveSprintIssuesCommandHandler,
]

@Module({
  imports: [TypeOrmModule.forFeature([Sprint]), CqrsModule],
  controllers: [SprintsController],
  providers: [SprintsUseCasesService, ...CommandHandlers],
  exports: [SprintsUseCasesService],
})
export class SprintsModule { }
