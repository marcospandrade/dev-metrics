import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateIntegrationServerDto } from '../dto/create-integration-server.dto';
import { IntegrationServer } from '../entities/integration-server.entity';
import { LoggerService } from '@core/logger/logger.service';

import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { SchemaValidator } from '@core/utils';
import { GetSpecificIssueDTO } from '@lib/atlassian/dto/get-specific-issue.dto';
import { GetAccessibleResourcesDTO } from '@lib/atlassian/dto/get-accessible-resources.dto';
import { CheckProjectIsSyncedDTO } from '../dto/check-project-is-synced.dto';

@Injectable()
export class IntegrationServerUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(IntegrationServer)
        private readonly integrationServerRepository: Repository<IntegrationServer>,
        private readonly atlassianUseCases: AtlassianUseCases,
    ) {}

    public async create(payload: CreateIntegrationServerDto): Promise<IntegrationServer> {
        const newIntegrationProject = this.integrationServerRepository.create({
            ...payload,
            userId: payload.userId,
        });
        this.logger.info(payload.name, 'Creating new integration project on the database with the title:');
        return this.integrationServerRepository.save(newIntegrationProject);
    }

    public async checkProjectIsSynced(integrationProjectId: string): Promise<CheckProjectIsSyncedDTO> {
        const integrationProject = await this.integrationServerRepository.findOne({
            where: {
                jiraId: integrationProjectId,
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

        if (!integrationProject) {
            throw new NotFoundException('Project not found');
        }

        this.logger.info({ integrationProject }, 'Checking if integration project was synced');

        if (integrationProject.isSynced) {
            return { synced: true, project: integrationProject };
        }
        return { synced: false, project: integrationProject };
    }

    public async getAllTickets(cloudId: string, userEmail: string) {
        const testQuery = `fields=description,summary`;
        const tickets = await this.atlassianUseCases.getIssues(cloudId, userEmail, testQuery);

        return tickets;
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
}
