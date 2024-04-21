import { Controller, Get, Post, Delete, ClassSerializerInterceptor, UseInterceptors, Param } from '@nestjs/common';
import { ResponseMessage } from '../decorators/response-message';
import { ApiExcludeController } from '@nestjs/swagger';
import { validateTimestampOrThrow } from '../../shared/helpers/validate-timestamp-or-throw';

import { MigrationsService } from './use-case/migrations.service';

@Controller('migration')
@ApiExcludeController()
@UseInterceptors(ClassSerializerInterceptor)
export class MigrationController {
    constructor(private migrationService: MigrationsService) {}

    @Get('ran')
    @ResponseMessage('Ran migrations fetched successfully')
    getRanMigrations() {
        return this.migrationService.findRanMigrations();
    }

    @Get('pending')
    @ResponseMessage('Pending migrations fetched successfully')
    getPedingMigrations() {
        return this.migrationService.findPendingMigrations();
    }

    @Post()
    @ResponseMessage('Migrations ran successfully')
    async migrateUp() {
        return this.migrationService.migrateUp();
    }

    @Post('timestamp/:timestamp')
    @ResponseMessage('Migration ran successfully')
    async migrateOneUp(
        @Param('timestamp', {
            transform: validateTimestampOrThrow,
        })
        timestamp: string,
    ) {
        return this.migrationService.migrateOneUp(timestamp);
    }

    @Delete()
    @ResponseMessage('Migrations reverted successfully')
    async migrateDown() {
        return this.migrationService.migrateDown();
    }

    @Delete('timestamp/:timestamp')
    @ResponseMessage('Migration reverted successfully')
    async migrateOneDown(
        @Param('timestamp', {
            transform: validateTimestampOrThrow,
        })
        timestamp: string,
    ) {
        return this.migrationService.migrateOneDown(timestamp);
    }
}
