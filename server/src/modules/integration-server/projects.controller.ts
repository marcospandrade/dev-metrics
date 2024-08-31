import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { ProjectUseCases } from './use-cases/projects.use-cases.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    public constructor(private readonly projectUseCases: ProjectUseCases) {}

    @Get('/:projectId')
    projectDetails(@Param('projectId') projectId: string) {
        return this.projectUseCases.findById([projectId]);
    }
}
