import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { SyncIssuesCommandHandler } from './commands/sync-issues/sync-issues.handler';
import { IssueUseCases } from './use-cases/issues.use-cases.service';
import { IssuesController } from './issues.controller';
import { IssueSaga } from './sagas/issue.saga';
import { Issue } from './entities/issue.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Issue]), CqrsModule],
    controllers: [IssuesController],
    providers: [IssueUseCases, IssueSaga, SyncIssuesCommandHandler],
})
export class IssuesModule {}
