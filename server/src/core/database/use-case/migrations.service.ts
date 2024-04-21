import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { MigrationFactory } from './migration.factory';

@Injectable()
export class MigrationsService implements OnApplicationBootstrap {
    constructor(private readonly migrationFactory: MigrationFactory) {}

    async onApplicationBootstrap() {
        await this.migrationFactory.runInitialMigrations();
    }

    async migrateOneUp(timestamp: string) {
        return this.migrationFactory.migrateOneUp(timestamp);
    }

    async migrateOneDown(timestamp: string) {
        return this.migrationFactory.migrateOneDown(timestamp);
    }

    async migrateUp() {
        return this.migrationFactory.migrateUp();
    }

    async migrateDown() {
        return this.migrationFactory.migrateDown();
    }

    async findPendingMigrations() {
        return this.migrationFactory.findPendingMigrations();
    }

    async findRanMigrations() {
        return this.migrationFactory.findRanMigrations();
    }
}
