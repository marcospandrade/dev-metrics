import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalculateIssueEstimativesCommandHandler } from './commands/calculate-issue-estimates/calculate-issue-estimates.handler';
import { FindAllIssuesQueryHandler } from './queries/find-all-issues/find-all-issues.query.handler';
import { SyncIssuesCommandHandler } from './commands/sync-issues/sync-issues.handler';
import { IssueUseCases } from './use-cases/issues.use-cases.service';
import { IssuesController } from './issues.controller';
import { IssueSaga } from './sagas/issue.saga';
import { Issue } from './entities/issue.entity';

const CommandHandlers = [SyncIssuesCommandHandler, CalculateIssueEstimativesCommandHandler];
const QueryHandlers = [FindAllIssuesQueryHandler];

@Module({
    imports: [TypeOrmModule.forFeature([Issue])],
    controllers: [IssuesController],
    providers: [IssueUseCases, IssueSaga, ...CommandHandlers, ...QueryHandlers],
})
export class IssuesModule {}
