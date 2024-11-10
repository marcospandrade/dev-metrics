import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { CreateIssueDto } from '../dto/create-issue.dto';
import { Issue } from '../entities/issue.entity';
import { LoggerService } from '@core/logger/logger.service';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { PaginationService } from '@shared/helpers/pagination/pagination.service';
import { SchemaValidator } from '@core/utils';
import { IssueSearch, ISSUES_SEARCH_FIELDS } from '../helpers/issue-search';
import { GenerateEstimateIssueDto } from '../dto/generate-estimate-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { EstimateCalculationType } from '../queries/calculate-issue-estimates/calculate-issue-estimates.query';

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

        return this.findAll(identifiers.map(i => i.id));
    }

    public async updateIssues(payload: UpdateIssueDto[]) {
        return this.issueRepository.save(payload);
    }

    public async findAll(ids: string[]) {
        this.logger.info({ ids }, 'Find all issues...');

        return this.issueRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    public async findAllProjectIssues(projectId: string) {
        return this.issueRepository.find({
            where: {
                projectId,
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

    public async calculateSimilarity(
        sourceIssue: GenerateEstimateIssueDto,
        issuesPool: GenerateEstimateIssueDto[],
        calculationType: EstimateCalculationType,
    ) {
        if (issuesPool.length === 0) {
            throw new NotFoundException('No issues found');
        } else if (!sourceIssue) {
            throw new NotFoundException(`To calculate similarity we need a source issue, but received ${sourceIssue}`);
        }
        this.logger.info('Generating estimatives for issue ' + sourceIssue.jiraIssueKey);

        return issuesPool
            .filter(issue => issue.id !== sourceIssue.id && !!issue.storyPoint)
            .map(dstIssue => {
                const similarity = Number(
                    Issue.compareSimilarity(sourceIssue[calculationType], dstIssue[calculationType]).toFixed(2),
                );
                return { id: sourceIssue.id, similarity, storyPoint: dstIssue.storyPoint };
            })
            .sort((a, b) => b.similarity - a.similarity);
    }
}
