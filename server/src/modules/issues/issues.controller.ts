import { Body, Controller, Post } from '@nestjs/common';
import { IssueUseCases } from './use-cases/issues.use-cases.service';
import { CreateIssueDto } from './dto/create-issue.dto';
// import { ValidateSchema } from '@core/decorators/validate-schema';

@Controller('issues')
export class IssuesController {
    public constructor(private readonly issueUseCases: IssueUseCases) {}

    @Post('/upsert')
    upsertTicket(@Body() payload: CreateIssueDto) {
        console.log('asduahsd');
        return this.issueUseCases.upsertMany([payload]);
    }
}
