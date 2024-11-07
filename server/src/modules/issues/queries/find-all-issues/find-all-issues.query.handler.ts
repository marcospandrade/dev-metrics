import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';
import { ValidateSchema } from '@core/decorators/validate-schema';
import { FindAllIssuesQuery } from './find-all-issues.query';

@QueryHandler(FindAllIssuesQuery)
export class FindAllIssuesQueryHandler implements IQueryHandler<FindAllIssuesQuery> {
    constructor(private readonly useCase: IssueUseCases) {}

    @ValidateSchema(FindAllIssuesQuery)
    async execute(query: FindAllIssuesQuery) {
        return this.useCase.findAllProjectIssues(query.projectId);
    }
}
