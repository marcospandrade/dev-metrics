import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { CreateIssueDto } from '../dto/create-issue.dto';
import { Issue } from '../entities/issue.entity';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class IssueUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(Issue) private readonly issueRepository: Repository<Issue>,
    ) {}
    public async upsertMany(payload: CreateIssueDto[]) {
        this.logger.info({ payload }, 'Upserting issues...');

        const { identifiers } = await this.issueRepository.upsert(payload, {
            conflictPaths: ['jiraIssueId'],
        });
        console.log('identifiers', identifiers);

        return this.findAll(identifiers.map(i => i.id));
    }

    public async findAll(ids: string[]) {
        this.logger.info({ ids }, 'Find all issues...');

        return this.issueRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    public async findTicketsByProject(projectId: string, userId: string) {
        this.logger.info('Finding tickets by project...');

        const [issues, count] = await this.issueRepository.findAndCountBy({
            projectId,
            project: {
                integrationServer: {
                    userId,
                },
            },
        });

        return {
            issues,
            count,
        };
    }
}
