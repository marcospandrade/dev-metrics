import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProjectSyncStatusQuery } from './get-project-sync-status.query';
import { LoggerService } from '@core/logger/logger.service';
import { CheckProjectIsSyncedDTO } from '@modules/integration-server/dto/check-project-is-synced.dto';
import { ProjectUseCases } from '@modules/integration-server/use-cases/projects.use-cases.service';
@QueryHandler(GetProjectSyncStatusQuery)
export class GetProjectSyncStatusQueryHandler
    implements IQueryHandler<GetProjectSyncStatusQuery, CheckProjectIsSyncedDTO>
{
    public constructor(
        private readonly logger: LoggerService,
        private readonly projectUseCases: ProjectUseCases,
    ) {}
    async execute(query: GetProjectSyncStatusQuery): Promise<CheckProjectIsSyncedDTO> {
        this.logger.info({ query }, 'Running GetProjectSyncStatusQueryHandler...');
        const result = await this.projectUseCases.checkProjectIsSynced(query.projectId);

        return result;
    }
}
