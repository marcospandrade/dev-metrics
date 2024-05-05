import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateIntegrationProjectDto } from '../dto/create-integration-project.dto';
import { IntegrationProject } from '../entities/integration-project.entity';
import { LoggerService } from '@core/logger/logger.service';
import { TCheckProjectIsSynced } from '../types/check-project-is-synced';

@Injectable()
export class IntegrationProjectUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(IntegrationProject)
        private readonly integrationProjectRepository: Repository<IntegrationProject>,
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
}
