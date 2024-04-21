import * as path from 'path';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { LoggerOptions } from 'typeorm';

export class OrmConfig {
    @IsString()
    DB_TYPE = 'postgres';

    @IsString()
    DB_HOST!: string;

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    DB_PORT!: number;

    @IsString()
    DB_USER!: string;

    @IsString()
    DB_PASSWORD!: string;

    @IsString()
    DB_NAME!: string;

    @IsBoolean()
    @Transform(({ value }) => {
        console.log(value);
        return value === 'true';
    })
    DB_SYNC = true;

    @IsArray()
    @Transform(({ value }) => value.split(','))
    DB_LOG_LEVEL!: LoggerOptions;

    @IsArray()
    entities = [path.resolve(__dirname, '..', '..', '..', '**/*.entity{.ts,.js}')];

    @IsString()
    migrationsTableName = 'migrations';

    @IsArray()
    migrations = [path.resolve(__dirname, 'modules', 'database', 'migrations', '**/*.ts')];
}
