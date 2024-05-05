import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateIntegrationProjectDto } from '../dto/create-integration-project.dto';
import { IntegrationProject } from '../entities/integration-project.entity';
import { LoggerService } from '@core/logger/logger.service';
import { TCheckProjectIsSynced } from '../types/check-project-is-synced';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { SchemaValidator } from '@core/utils';
import { GetSpecificIssueDTO } from '@lib/atlassian/dto/get-specific-issue.dto';
import { GetAccessibleResourcesDTO } from '@lib/atlassian/dto/get-accessible-resources.dto';

@Injectable()
export class IntegrationProjectUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(IntegrationProject)
        private readonly integrationProjectRepository: Repository<IntegrationProject>,
        private readonly atlassianUseCases: AtlassianUseCases,
    ) {}

    public async create(payload: CreateIntegrationProjectDto): Promise<IntegrationProject> {
        const newIntegrationProject = this.integrationProjectRepository.create({
            ...payload,
            userId: payload.userId,
        });
        this.logger.info(payload.name, 'Creating new integration project on the database with the title:');
        return this.integrationProjectRepository.save(newIntegrationProject);
    }

    public async checkProjectIsSynced(integrationProjectId: string): Promise<TCheckProjectIsSynced> {
        const integrationProject = await this.integrationProjectRepository.findOne({
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
