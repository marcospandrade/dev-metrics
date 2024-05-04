import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntegrationProjectUseCases } from './use-cases/integration-project.use-cases.service';
import { IntegrationProject } from './entities/integration-project.entity';
import { CreateIntegrationProjectCommandHandler } from './commands/create-integration-project.handler';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationProject])],
    providers: [IntegrationProjectUseCases, CreateIntegrationProjectCommandHandler],
})
export class IntegrationProjectModule {}
