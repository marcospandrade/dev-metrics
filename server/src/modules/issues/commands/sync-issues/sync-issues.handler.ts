import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SyncIssuesCommand } from './sync-issues.command';
import { LoggerService } from '@core/logger/logger.service';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';

@CommandHandler(SyncIssuesCommand)
export class SyncIssuesCommandHandler implements ICommandHandler<SyncIssuesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly issueUseCases: IssueUseCases,
    ) {}

    public async execute(command: SyncIssuesCommand): Promise<any> {
        this.logger.info({ command }, 'Starting sync issues...');

        const syncedIssues = await this.issueUseCases.upsertMany(command.issues);

        return syncedIssues;
    }
}
