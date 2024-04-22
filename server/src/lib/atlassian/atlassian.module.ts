import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AtlassianUseCases } from './services/atlassian.use-cases.service';
import { AtlassianFactoryService } from './services/atlassian-factory.service';

@Module({
    imports: [HttpModule],
    exports: [AtlassianUseCases, AtlassianFactoryService],
    providers: [AtlassianUseCases, AtlassianFactoryService],
})
export class AtlassianModule {}
