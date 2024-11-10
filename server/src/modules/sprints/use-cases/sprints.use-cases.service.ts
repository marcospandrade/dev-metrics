import { LoggerService } from '@core/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sprint } from '../entities/sprint.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '@shared/helpers/pagination/pagination.service';
import { GenericQueryDto } from '@shared/helpers/pagination/query';
import { SprintSearch } from '../helpers/sprint-search';
import { SchemaValidator } from '@core/utils';
import { CreateSprintDto } from '../dtos/create-sprint.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSprintIssuesCommand } from '@modules/sprint-issues/commands/create-sprint-issues/create-sprint-issues.command';
import { CreateSprintIssueDto } from '@modules/sprint-issues/dto/create-sprint-issue.dto';
import { RemoveSprintIssuesCommand } from '@modules/sprint-issues/commands/remove-sprint-issues/remove-sprint-issues.command';
import { RemoveSprintIssueDto } from '../../sprint-issues/dto/remove-sprint-issue.dto';
import { UpdateSprintDto } from '../dtos/update-sprint.dto';

@Injectable()
export class SprintsUseCasesService extends PaginationService {
    public constructor(
        private readonly logger: LoggerService,
        private readonly commandBus: CommandBus,
        @InjectRepository(Sprint) private readonly sprintRepository: Repository<Sprint>,
    ) {
        super();
    }

    public async findAllPaginated(userId: string, query: GenericQueryDto & SprintSearch) {
        const { page, pageSize, sortOrder, orderBy } = query;
        const qb = this.sprintRepository.createQueryBuilder('sprint').where('sprint.userId = :userId', { userId });

        const { data, count } = await this.paginate(
            qb,
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

        return {
            sprints: data,
            count,
        };
    }

    public async findById(id: string) {
        return this.sprintRepository.findOne({
            where: {
                id,
            },
            relations: {
                issuesList: {
                    issue: {
                        project: {
                            customFields: true,
                        },
                    },
                },
            },
            select: {
                issuesList: {
                    id: true,
                    issue: {
                        id: true,
                        customFields: true as any,
                        summary: true,
                        jiraIssueKey: true,
                        estimatedStoryPoints: true,
                        project: {
                            id: true,
                            customFields: true,
                        },
                    },
                },
            },
        });
    }

    public async createSprint(payload: CreateSprintDto) {
        const { issuesList = [], ...sprint } = payload;
        const createdSprint = await this.sprintRepository.save(sprint);

        if (issuesList.length > 0) {
            const updatedIssues = await this.addSprintIssues(
                issuesList.map(({ id: issueId }) => ({ sprintId: createdSprint.id, issueId })),
            );
            createdSprint.issuesList = updatedIssues;
        }

        return createdSprint;
    }

    public async deleteSprint(id: string) {
        return this.sprintRepository.softDelete({ id });
    }

    public async addSprintIssues(issuesList: CreateSprintIssueDto[]) {
        return this.commandBus.execute(SchemaValidator.toInstance({ issuesList }, CreateSprintIssuesCommand));
    }

    public async removeSprintIssues(issuesList: RemoveSprintIssueDto) {
        return this.commandBus.execute(SchemaValidator.toInstance(issuesList, RemoveSprintIssuesCommand));
    }

    public async updateSprint(id: string, payload: UpdateSprintDto) {
        await this.sprintRepository.update({ id }, payload);
        return this.sprintRepository.findOne({ where: { id } });
    }
}
