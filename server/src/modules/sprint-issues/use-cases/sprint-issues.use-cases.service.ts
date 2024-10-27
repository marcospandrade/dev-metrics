import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { RemoveSprintIssueDto } from '@modules/sprint-issues/dto/remove-sprint-issue.dto';
import { Sprint } from '@modules/sprints/entities/sprint.entity';
import { LoggerService } from '@core/logger/logger.service';
import { CreateSprintIssueDto } from '../dto/create-sprint-issue.dto';
import { SprintIssue } from '../entities/sprint-issue.entity';

@Injectable()
export class SprintIssuesUseCasesService {
    constructor(
        private logger: LoggerService,
        @InjectRepository(SprintIssue) private repository: Repository<SprintIssue>
    ) { }

    async create(dto: CreateSprintIssueDto): Promise<SprintIssue> {
        return this.repository.create(dto).save();
    }

    async createMany(dtos: CreateSprintIssueDto[]): Promise<SprintIssue[]> {
        return new Promise(async (resolve, reject) => {
            await this.repository.manager.transaction(async manager => {
                try {
                    const createdSprintIssues = [];
                    const sprints = new Map<string, Sprint>();
                    for (const sprintIssueToCreate of dtos) {
                        let sprint = sprints.get(sprintIssueToCreate.sprintId) || await manager.findOne(Sprint, { where: { id: sprintIssueToCreate.sprintId } });
                        if (!sprint) {
                            reject(new ConflictException('Sprint not found'));
                        }

                        let sprintIssue = await manager.findOne(SprintIssue,
                            {
                                where: { issueId: sprintIssueToCreate.issueId, sprintId: sprintIssueToCreate.sprintId },
                                withDeleted: true,
                            }
                        );
                        if (!!sprintIssue?.deletedAt) {
                            sprintIssue.deletedAt = null;
                            await manager.save(sprintIssue);
                        } else if (!sprintIssue) {
                            sprintIssue = await manager.create(SprintIssue, sprintIssueToCreate).save();
                        }

                        createdSprintIssues.push(sprintIssue);
                    }
                    resolve(createdSprintIssues);
                } catch (error) {
                    if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                        reject(new ConflictException('Sprint issue already exists'));
                    } else {
                        reject(error);
                    }
                }
            })
        })
    }

    async deleteManyByIssueAndSprintIds(dto: RemoveSprintIssueDto) {
        const sprintIssues = await this.repository.findBy({ issueId: In(dto.issuesList.map(({ id }) => id)), sprintId: dto.sprintId });
        if (sprintIssues.length === 0) {
            return 0;
        }

        const { affected } = await this.repository.softDelete(sprintIssues.map(sprintIssue => sprintIssue.id));
        return affected;
    }

    async findAll(): Promise<SprintIssue[]> {
        return this.repository.find();
    }

    async findOne(id: string): Promise<SprintIssue> {
        return this.repository.findOneBy({ id });
    }

    async delete(id: string) {
        return this.repository.delete(id);
    }
}
