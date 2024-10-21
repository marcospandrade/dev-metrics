import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { CreateIssueDto } from '../dto/create-issue.dto';
import { Issue } from '../entities/issue.entity';
import { LoggerService } from '@core/logger/logger.service';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { PaginationService } from '@shared/helpers/pagination/pagination.service';
import { SchemaValidator } from '@core/utils';
import { IssueSearch, ISSUES_SEARCH_FIELDS } from '../helpers/issue-search';
import { SetIssueSprintDto } from '../dto/set-issue-sprint.dto';

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

    public async findTicketsByProject(serverExternalId: string, userId: string, query: GenericQueryDto & IssueSearch) {
        this.logger.info('Finding tickets by project...');

        const { page, pageSize, sortOrder, orderBy, searchText } = query;

        const { data, count } = await this.paginate(
            this.createQueryBuilderWithFilters<Issue>(
                serverExternalId,
                'projectId',
                searchText,
                ISSUES_SEARCH_FIELDS,
                this.issueRepository,
            ),
            SchemaValidator.toInstance(
                {
                    page,
                    pageSize,
                    sortOrder,
                    orderBy,
                },
                GenericQueryDto,
            ),
        );

        this.logger.info({ count }, 'Found tickets by project');

        return {
            issues: data,
            count,
        };
    }

    public setIssuesSprint(payload: SetIssueSprintDto[]): Promise<Issue[]> {
        return new Promise(async resolve => {
            await this.issueRepository.manager.transaction(async manager => {
                for (const issue of payload) {
                    await manager.update(Issue, issue.id, { sprintId: issue.sprintId });
                }

                const updatedIssues = await manager.findBy(Issue, { id: In(payload.map(i => i.id)) });
                resolve(updatedIssues);
            })
        })
    }
}
