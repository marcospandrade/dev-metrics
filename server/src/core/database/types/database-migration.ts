import { MigrationInterface } from 'typeorm';

export interface RanMigration {
    timestamp: number;
    name: string;
    id: number;
}

export interface DatabaseMigration extends MigrationInterface {
    requiredForAppInitialization: boolean;
    migrated?: boolean;
    name?: string;
}

export type MigrationConstructable = new (...args: any[]) => DatabaseMigration;
