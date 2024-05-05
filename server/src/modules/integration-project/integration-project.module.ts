import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntegrationProjectUseCases } from './use-cases/integration-project.use-cases.service';
import { IntegrationProject } from './entities/integration-project.entity';
import { CreateIntegrationProjectCommandHandler } from './commands/create-integration-project/create-integration-project.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationProject]), CqrsModule],
    providers: [IntegrationProjectUseCases, CreateIntegrationProjectCommandHandler],
})
export class IntegrationProjectModule {}
