import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProjectSyncStatusQuery } from './get-project-sync-status.query';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { of } from 'rxjs';

@QueryHandler(GetProjectSyncStatusQuery)
export class GetProjectSyncStatusQueryHandler implements IQueryHandler<GetProjectSyncStatusQuery> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
    ) {}
    async execute(query: GetProjectSyncStatusQuery): Promise<any> {
        const result = await this.integrationServerUseCases.checkProjectIsSynced(query.jiraId);

        if (!result.synced) {
        }

        this.logger.info({ result }, 'GetProjectSyncStatusQueryHandler executed successfully');
        return of(result);
    }
}
