import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, In, Repository } from 'typeorm';

import { CreateIssueDto } from '../dto/create-issue.dto';
import { Issue } from '../entities/issue.entity';
import { LoggerService } from '@core/logger/logger.service';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { PaginationService } from '@shared/helpers/pagination/pagination.service';
import { IssueSearch } from '../issues.controller';
import { SchemaValidator } from '@core/utils';

@Injectable()
export class IssueUseCases extends PaginationService {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(Issue) private readonly issueRepository: Repository<Issue>,
    ) {
        super();
    }

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

    public async findTicketsByProject(projectId: string, userId: string, query: GenericQueryDto & IssueSearch) {
        this.logger.info('Finding tickets by project...');
        const { ...params } = query;
        const [issues, count] = await this.paginate(
            this.issueRepository,
            SchemaValidator.toInstance(query, GenericQueryDto),
            this.createWhereQuery(params),
        );

        this.logger.info({ count }, 'Found tickets by project');

        return {
            issues,
            count,
        };
    }

    private createWhereQuery(params: IssueSearch) {
        const where: any = {};

        if (params.jiraIssueKey) {
            where.jiraIssueKey = ILike(`%${params.jiraIssueKey}%`);
        }

        if (params.summary) {
            where.summary = ILike(`%${params.summary}%`);
        }

        return where;
    }
}
