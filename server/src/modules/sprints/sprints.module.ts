import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintsController } from './sprints.controller';
import { SprintsUseCasesService } from './use-cases/sprints.use-cases.service';
import { Sprint } from './entities/sprint.entity';
import { CreateSprintCommandHandler } from './commands/create-sprint/create-sprint.handler';
import { UpdateSprintCommandHandler } from './commands/update-sprint/update-sprint.handler';
import { DeleteSprintCommandHandler } from './commands/delete-sprint/delete-sprint.handler';

const CommandHandlers = [CreateSprintCommandHandler, UpdateSprintCommandHandler, DeleteSprintCommandHandler];

@Module({
    imports: [TypeOrmModule.forFeature([Sprint])],
    controllers: [SprintsController],
    providers: [SprintsUseCasesService, ...CommandHandlers],
    exports: [SprintsUseCasesService],
})
export class SprintsModule {}
