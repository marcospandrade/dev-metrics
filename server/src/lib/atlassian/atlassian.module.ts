import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AtlassianUseCases } from './services/atlassian.use-cases.service';
import { AtlassianFactoryService } from './services/atlassian-factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/auth/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), HttpModule],
    exports: [AtlassianUseCases, AtlassianFactoryService],
    providers: [AtlassianUseCases, AtlassianFactoryService],
})
export class AtlassianModule {}
