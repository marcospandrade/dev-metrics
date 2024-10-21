import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { SetIssueSprintCommand } from './set-issue-sprint.command';

@CommandHandler(SetIssueSprintCommand)
export class SetIssueSprintCommandHandler implements ICommandHandler<SetIssueSprintCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly issueUseCases: IssueUseCases,
    ) { }

    public async execute(command: SetIssueSprintCommand) {
        return this.issueUseCases.setIssuesSprint(command.issues);
    }
}
