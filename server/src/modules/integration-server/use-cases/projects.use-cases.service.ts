import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, In } from 'typeorm';

import { LoggerService } from '@core/logger/logger.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { Project } from '../entities/project.entity';
import { CheckProjectIsSyncedDTO } from '../dto/check-project-is-synced.dto';

@Injectable()
export class ProjectUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    public async upsertMany(payload: CreateProjectDto[]) {
        const { identifiers } = await this.projectRepository.upsert(payload, { conflictPaths: ['atlassianId'] });

        if (!identifiers) {
            throw new InternalServerErrorException('Error trying to upsert projects');
        }

        this.logger.info({ identifiers }, 'Upsert projects with success: ');

        return this.findById(identifiers.map(i => i.id));
    }

    public async findById(id: string[]) {
        return this.projectRepository.find({ where: { id: In(id) } });
    }

    public async checkProjectIsSynced(id: string): Promise<CheckProjectIsSyncedDTO> {
        const integrationProject = await this.projectRepository.findOne({
            where: {
                id,
            },
            select: {
                integrationServer: {
                    user: {
                        email: true,
                    },
                },
            },
            relations: {
                integrationServer: true,
            },
        });

        if (!integrationProject) {
            throw new NotFoundException('Project not found');
        }

        this.logger.info({ integrationProject }, 'Checked project sync status');

        if (integrationProject) {
            return { synced: true, project: integrationProject };
        }
        return { synced: false, project: integrationProject };
    }
}
