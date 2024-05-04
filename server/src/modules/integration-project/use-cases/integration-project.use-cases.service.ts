import { Injectable } from '@nestjs/common';
import { CreateIntegrationProjectDto } from '../dto/create-integration-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegrationProject } from '../entities/integration-project.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class IntegrationProjectUseCases {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(IntegrationProject)
        private readonly integrationProjectRepository: Repository<IntegrationProject>,
    ) {}

    public async create(payload: CreateIntegrationProjectDto): Promise<IntegrationProject> {
        this.logger.info(payload.name, 'Creating new integration project on the database with the title:');
        return this.integrationProjectRepository.save(payload);
    }
}
