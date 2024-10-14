import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllIssuesFieldsQuery } from './get-all-issues-fields.query';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';
import { AtlassianCustomType } from '@lib/atlassian/types/atlassian-custom-field.type';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';
import { GetAllIssuesFieldsDto } from '@lib/atlassian/dto/get-all-issues-fields.dto';

@QueryHandler(GetAllIssuesFieldsQuery)
export class GetAllIssuesFieldsQueryHandler
    implements IQueryHandler<GetAllIssuesFieldsQuery, AtlassianCustomType[]> {
    public constructor(
        private readonly atlassianUseCases: AtlassianUseCases,
        private readonly service: IntegrationServerUseCases,
        private readonly logger: LoggerService,
    ) { }

    async execute(query: GetAllIssuesFieldsQuery) {
        this.logger.info(`Search all fields into Atlassian Server for project ${query.projectId}`);
        const integrationServer = await this.service.getServerByProjectId(query.projectId);
        const fields = await this.atlassianUseCases.getAllIssuesFields(
            SchemaValidator.toInstance({ cloudId: integrationServer.jiraId, userEmail: query.userEmail }, GetAllIssuesFieldsDto),
        );
        return fields;
    }
}
