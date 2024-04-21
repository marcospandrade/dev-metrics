import { readdir } from 'fs/promises';
import path from 'path';

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '../../logger/logger.service';

import { QueryRunnerWithModuleRef } from '../types/query-runner-with-module-ref';
import { DatabaseMigration, MigrationConstructable, RanMigration } from '../types/database-migration';

@Injectable()
export class MigrationFactory {
    constructor(
        private readonly dataSource: DataSource,
        private readonly logger: LoggerService,
        private readonly moduleRef: ModuleRef,
    ) {}

    /**
     * Runs the initial migrations required for the application to function properly.
     * This method loads all migrations from disk, checks which ones have not been ran yet,
     * and runs them in order using a transaction. Only migrations that have the
     * `requiredForAppInitialization` flag set to `true` will be ran.
     *
     * @throws {Error} If there's an error running any of the migrations.
     */
    async runInitialMigrations() {
        try {
            this.logger.info('Running initial migrations');

            // make sure migrations table exists
            await this.dataSource.showMigrations();

            const migrations = await this.loadMigrations();

            for (const migration of migrations) {
                if (migration.migrated || !migration.requiredForAppInitialization) {
                    continue;
                }

                await this.runMigrationWithTransaction(migration);
            }

            this.logger.info('Initial migrations ran successfully');
        } catch (error) {
            this.logger.error(error, 'Error running initial migrations');
            throw error;
        }
    }

    /**
     * Runs a single migration with the given timestamp in the "up" direction.
     * This method finds the migration with the given timestamp, checks if it has
     * already been ran, and runs it in the "up" direction using a transaction.
     *
     * @param {string} timestamp The timestamp of the migration to run.
     * @returns A promise that resolves to an array of all ran migrations.
     * @throws {UnprocessableEntityException} If the migration has already been ran.
     * @throws {UnprocessableEntityException} If the migration with the given timestamp cannot be found.
     * @throws {Error} If there's an error running the migration.
     */
    async migrateOneUp(timestamp: string) {
        const migration = await this.findMigrationByTimestamp(timestamp);

        if (migration.migrated) {
            throw new UnprocessableEntityException('Migration already ran');
        }

        await this.runMigrationWithTransaction(migration);

        return this.queryMigrations();
    }

    /**
     * Runs a single migration with the given timestamp in the "down" direction.
     * This method finds the migration with the given timestamp, checks if it has
     * already been ran, and runs it in the "down" direction using a transaction.
     *
     * @param {string} timestamp The timestamp of the migration to run.
     * @returns A promise that resolves to an array of all ran migrations.
     * @throws {UnprocessableEntityException} If the migration has not been ran yet.
     * @throws {UnprocessableEntityException} If the migration with the given timestamp cannot be found.
     * @throws {Error} If there's an error running the migration.
     */
    async migrateOneDown(timestamp: string) {
        const migration = await this.findMigrationByTimestamp(timestamp);

        if (!migration.migrated) {
            throw new UnprocessableEntityException('Migration not ran yet');
        }

        await this.runMigrationWithTransaction(migration, 'down');

        return this.queryMigrations();
    }

    /**
     * Runs all pending migrations in the "up" direction.
     * This method gets all pending migrations, and runs them in the "up" direction
     * using a transaction. Only migrations that have not been ran yet will be ran.
     *
     * @returns A promise that resolves to an array of all ran migrations.
     * @throws {Error} If there's an error running any of the migrations.
     */
    async migrateUp() {
        const pendingMigrations = await this.getPedingMigrations();

        for (const migration of pendingMigrations) {
            await this.runMigrationWithTransaction(migration);
        }

        return this.queryMigrations();
    }

    /**
     * Runs all ran migrations in the "down" direction.
     * This method gets all ran migrations, and runs them in the "down" direction
     * using a transaction. Only migrations that have been ran will be ran.
     *
     * @returns A promise that resolves to an array of all ran migrations.
     * @throws {Error} If there's an error running any of the migrations.
     */
    async migrateDown() {
        const ranMigrations = await this.queryMigrations('DESC');

        if (ranMigrations.length === 0) {
            return this.queryMigrations();
        }

        const migrations = await this.loadMigrations();
        const migrationToRunDown = migrations.filter((migration) => {
            return migration.migrated;
        });

        for (const migration of migrationToRunDown) {
            await this.runMigrationWithTransaction(migration, 'down');
        }

        return this.queryMigrations();
    }

    /**
     * Finds all pending migrations.
     * This method gets all pending migrations, which are migrations that have not been ran yet.
     *
     * @returns A promise that resolves to an array of all pending migrations.
     */
    async findPendingMigrations(): Promise<DatabaseMigration[]> {
        return this.getPedingMigrations();
    }

    /**
     * Finds all ran migrations.
     * This method gets all ran migrations, which are migrations that have already been ran.
     *
     * @returns A promise that resolves to an array of all ran migrations.
     */
    async findRanMigrations(): Promise<RanMigration[]> {
        return this.queryMigrations();
    }

    /**
     * Finds a migration by its timestamp.
     * This method loads all migrations from disk, and finds the migration with the given timestamp.
     *
     * @param {string} timestamp The timestamp of the migration to find.
     * @returns A promise that resolves to the migration with the given timestamp.
     * @throws {UnprocessableEntityException} If the migration with the given timestamp cannot be found.
     */
    private async findMigrationByTimestamp(timestamp: string) {
        const migrations = await this.loadMigrations();
        const migration = migrations.find((m) => m.name.includes(timestamp));

        if (!migration) {
            throw new UnprocessableEntityException('Migration not found');
        }

        return migration;
    }

    /**
     * @description Persists migration to database using transaction
     *
     * If migration fails, it will ```rollback``` the transaction
     * @param migration Migration class instance to run
     * @param direction Direction of migration (up or down)
     */
    private async runMigrationWithTransaction(migration: DatabaseMigration, direction: 'up' | 'down' = 'up') {
        this.logger.info(`Running migration ${migration.constructor.name} with direction ${direction}`);

        const queryRunner = this.dataSource.createQueryRunner() as QueryRunnerWithModuleRef;

        // We need to pass the moduleRef to the queryRunner so that it can
        // instantiate the migration class with the correct dependencies
        // (e.g. repositories, services, etc.)
        queryRunner.moduleRef = this.moduleRef;

        try {
            this.logger.info(`Starting transaction for migration ${migration.constructor.name}`);

            await queryRunner.startTransaction();

            if (direction === 'up') {
                await migration.up(queryRunner);

                await this.insertMigrationIntoMigrationsTable(migration);
            } else if (direction === 'down') {
                await migration.down(queryRunner);

                await this.deleteMigrationFromMigrationsTable(migration);
            }

            this.logger.info(`Commiting transaction for migration ${migration.constructor.name}`);

            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.error(
                error,
                `Error running migration ${migration.constructor.name}. Rolling back transaction.`,
            );

            await queryRunner.rollbackTransaction();

            throw error;
        }
    }

    /**
     * @description Insert migration into migrations table
     * @param migration Migration class instance to insert into database
     */
    private insertMigrationIntoMigrationsTable(migration: DatabaseMigration) {
        const unixTimestamp = new Date().getTime();

        return this.dataSource.query(
            `INSERT INTO migrations (timestamp, name) VALUES (${unixTimestamp}, '${migration.constructor.name}')`,
        );
    }

    /**
     * @description Delete migration from migrations table
     * @param migration Migration class to delete from database
     */
    private deleteMigrationFromMigrationsTable(migration: DatabaseMigration) {
        return this.dataSource.query(`DELETE FROM migrations WHERE name = '${migration.constructor.name}'`);
    }

    /**
     * @description Get migrations that have been ran from the database
     */
    private queryMigrations(order: 'ASC' | 'DESC' = 'ASC'): Promise<RanMigration[]> {
        return this.dataSource.query(`SELECT * FROM migrations ORDER BY timestamp ${order}`);
    }

    /**
     * Loads all migrations from disk and checks which ones have been ran.
     * This method scans the migrations directory for migration names, loads each migration
     * class, and checks if it has already been ran by querying the migrations table.
     * If a migration has already been ran, its `migrated` property is set to `true`.
     * If a migration has not been ran yet, its `migrated` property is set to `false`.
     *
     * @returns A promise that resolves to an array of all migrations, with their `migrated` property set accordingly.
     */
    private async loadMigrations() {
        const migrationsFromDisk = await this.scanDiskForMigrationNames();
        const ranMigrations = await this.queryMigrations();

        const migrations: DatabaseMigration[] = [];

        for (const migrationName of migrationsFromDisk) {
            // TODO: add some sort of filter to only load migrations that are
            // valid (e.g. implement a DatabaseMigration interface and check if the class implements it)
            const migrationPath = path.resolve(__dirname, '..', 'migrations', `${migrationName}`);
            const DatabaseMigrationConstructable = await import(migrationPath).then(
                (m) => m.default as MigrationConstructable,
            );

            const databaseMigration = new DatabaseMigrationConstructable();

            const ranMigration = ranMigrations.find((ranMigration) => {
                return ranMigration.name === databaseMigration.constructor.name;
            });

            if (ranMigration) {
                databaseMigration.migrated = true;
                databaseMigration.name = ranMigration.name;
            } else {
                databaseMigration.migrated = false;
            }

            if (!databaseMigration.name) {
                databaseMigration.name = databaseMigration.constructor.name;
            }

            migrations.push(databaseMigration);
        }

        return migrations;
    }

    /**
     * @description Get migration file names (from disk)
     */
    private async scanDiskForMigrationNames() {
        const migrationsFolderPath = path.resolve(__dirname, '..', 'migrations');
        const migrations = await readdir(migrationsFolderPath);

        return migrations
            .filter((migrationName) => {
                return migrationName.endsWith('.js');
            })
            .map((migrationName) => {
                return migrationName.replace('.js', '');
            });
    }

    /**
     * @description Get migrations that have not been ran yet
     */
    private async getPedingMigrations() {
        const migrations = await this.loadMigrations();

        return migrations.filter((migration) => {
            return !migration.migrated;
        });
    }
}
