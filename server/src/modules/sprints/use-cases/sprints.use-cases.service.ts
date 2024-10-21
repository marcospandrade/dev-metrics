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
import { SetIssueSprintCommand } from '@modules/issues/commands/set-issue-sprint/set-issue-sprint.command';

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
        const qb = this.sprintRepository
            .createQueryBuilder('sprint')
            .where('sprint.userId = :userId', { userId });

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
            relations: ['issues']
        });
    }

    public async createSprint(payload: CreateSprintDto) {
        const { issuesList = [], ...sprint } = payload;
        const createdSprint = await this.sprintRepository.save(sprint);

        if (issuesList.length > 0) {
            const updatedIssues = await this.commandBus.execute(SchemaValidator.toInstance(
                { issues: issuesList.map(({ id }) => ({ id, sprintId: createdSprint.id })) },
                SetIssueSprintCommand,
            ));

            createdSprint.issuesList = updatedIssues;
        }

        return createdSprint;
    }
}