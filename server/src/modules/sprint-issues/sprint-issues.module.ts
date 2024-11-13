import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintIssue } from './entities/sprint-issue.entity';
import { SprintIssuesUseCasesService } from './use-cases/sprint-issues.use-cases.service';
import { CreateSprintIssuesCommandHandler } from './commands/create-sprint-issues/create-sprint-issues.handler';
import { RemoveSprintIssuesCommandHandler } from './commands/remove-sprint-issues/remove-sprint-issues.handler';

const CommandHandlers = [CreateSprintIssuesCommandHandler, RemoveSprintIssuesCommandHandler];

@Module({
    imports: [TypeOrmModule.forFeature([SprintIssue])],
    providers: [SprintIssuesUseCasesService, ...CommandHandlers],
    exports: [SprintIssuesUseCasesService],
})
export class SprintIssuesModule {}
