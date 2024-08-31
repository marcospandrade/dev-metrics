import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, In } from 'typeorm';

import { UpsertIntegrationServerDto } from '../dto/create-integration-server.dto';
import { IntegrationServer } from '../entities/integration-server.entity';
import { LoggerService } from '@core/logger/logger.service';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { SchemaValidator } from '@core/utils';
import { GetSpecificIssueDTO } from '@lib/atlassian/dto/get-specific-issue.dto';
import { GetAccessibleResourcesDTO } from '@lib/atlassian/dto/get-accessible-resources.dto';
import { GetPaginatedProjectsDTO } from '@lib/atlassian/dto/get-paginated-projects.dto';
import { AtlassianProject } from '@lib/atlassian/types/atlassian-project.type';
import { QueryIssues } from '@lib/atlassian/types/issues.type';
import { generateQueryIssueString } from '@lib/atlassian/helpers/issue.helper';
import { SearchFieldByNameDto } from '@lib/atlassian/dto/search-field-by-name.dto';
import { PaginatedResponse } from '@lib/atlassian/types/paginated-response.type';

@Injectable()
export class IntegrationServerUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(IntegrationServer)
        private readonly integrationServerRepository: Repository<IntegrationServer>,
        private readonly atlassianUseCases: AtlassianUseCases,
    ) {}

    public async upsert(payload: UpsertIntegrationServerDto): Promise<IntegrationServer> {
        this.logger.info({ payload }, 'Upserting integration project on the database with the title:');
        const { identifiers } = await this.integrationServerRepository.upsert(
            {
                ...payload,
                userId: payload.userId,
            },
            {
                conflictPaths: ['jiraId', 'url'],
                upsertType: 'on-conflict-do-update',
            },
        );

        return this.findServerById(identifiers[0].id);
    }

    public async bulkFindServer(ids: string[]) {
        return this.integrationServerRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    public async findServerById(id: string): Promise<IntegrationServer> {
        this.logger.info({ serverId: id }, 'Finding server by id:');
        return this.integrationServerRepository.findOne({
            where: {
                id,
            },
            select: {
                user: {
                    email: true,
                },
            },
            relations: {
                user: true,
            },
        });
    }

    public async getAllTickets(cloudId: string, userEmail: string, query?: QueryIssues) {
        const queryString = generateQueryIssueString(query);
        const paginatedIssues = await this.atlassianUseCases.getIssues(cloudId, userEmail, queryString);

        return paginatedIssues;
    }

    public async getIssueById(cloudId: string, userEmail: string, issueId: string) {
        // const testQuery = `fields=issuetype.name,parent.id,parent.key,priority.name,assignee.displayName,status.name,summary,description`;
        // const testQuery = `fields=issuetype&properties=name&fields=parent,priority,assignee,status,summary,description`;
        const ticket = await this.atlassianUseCases.getSpecificIssue(
            SchemaValidator.toInstance({ cloudId, userEmail, issueId, query: '' }, GetSpecificIssueDTO),
        );

        return ticket;
    }

    public getUserAccessibleResources(userEmail: string) {
        return this.atlassianUseCases.getAccessibleResources(
            SchemaValidator.toInstance({ userEmail }, GetAccessibleResourcesDTO),
        );
    }

    public async getServerProjects(serverId: string, userEmail: string): Promise<PaginatedResponse<AtlassianProject>> {
        return this.atlassianUseCases.getPaginatedProjects(
            SchemaValidator.toInstance({ userEmail, cloudId: serverId }, GetPaginatedProjectsDTO),
        );
    }

    public async searchFieldIdByName(payload: SearchFieldByNameDto) {
        return this.atlassianUseCases.searchByFieldName(SchemaValidator.toInstance(payload, SearchFieldByNameDto));
    }
}
