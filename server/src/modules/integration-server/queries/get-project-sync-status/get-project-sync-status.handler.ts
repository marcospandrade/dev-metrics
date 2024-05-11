import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProjectSyncStatusQuery } from './get-project-sync-status.query';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { CheckProjectIsSyncedDTO } from '@modules/integration-server/dto/check-project-is-synced.dto';

@QueryHandler(GetProjectSyncStatusQuery)
export class GetProjectSyncStatusQueryHandler
    implements IQueryHandler<GetProjectSyncStatusQuery, CheckProjectIsSyncedDTO>
{
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
    ) {}
    async execute(query: GetProjectSyncStatusQuery): Promise<CheckProjectIsSyncedDTO> {
        this.logger.info({ query }, 'Running GetProjectSyncStatusQueryHandler...');
        const result = await this.integrationServerUseCases.checkProjectIsSynced(query.jiraId);

        return result;
    }
}
