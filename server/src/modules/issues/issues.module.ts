import { Module } from '@nestjs/common';
import { IssuesService } from './use-cases/issues.use-cases.service';
import { IssuesController } from './issues.controller';

@Module({
    controllers: [IssuesController],
    providers: [IssuesService],
})
export class IssuesModule {}
