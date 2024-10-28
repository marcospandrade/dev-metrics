import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintsController } from './sprints.controller';
import { SprintsUseCasesService } from './use-cases/sprints.use-cases.service';
import { Sprint } from './entities/sprint.entity';
import { CreateSprintCommandHandler } from './commands/create-sprint/create-sprint.handler';
import { UpdateSprintCommandHandler } from './commands/update-sprint/update-sprint.handler';

const CommandHandlers = [CreateSprintCommandHandler, UpdateSprintCommandHandler];

@Module({
    imports: [TypeOrmModule.forFeature([Sprint])],
    controllers: [SprintsController],
    providers: [SprintsUseCasesService, ...CommandHandlers],
    exports: [SprintsUseCasesService],
})
export class SprintsModule {}
