import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { TypeORMCustomNamingStrategy } from '@core/database/helpers/typeorm-custom-naming-strategy';
import { ServerAppConfig } from '../../app.module';
import { MigrationController } from './migration.controller';
import { MigrationsService } from './use-case/migrations.service';
import { MigrationFactory } from './use-case/migration.factory';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            dataSourceFactory: (dataSource: any) => new DataSource(dataSource).initialize(),
            useFactory: async (configService: ConfigService<ServerAppConfig>): Promise<TypeOrmModuleOptions> => {
                const host = configService.get('DB_HOST');
                const port = configService.get('DB_PORT');
                const username = configService.get('DB_USER');
                const password = configService.get('DB_PASSWORD');
                const database = configService.get('DB_NAME');
                const synchronize = configService.get('DB_SYNC');
                const logging = configService.get('DB_LOG_LEVEL');
                const entities = configService.get('entities');
                const migrationsTableName = configService.get('migrationsTableName');
                const type = configService.get('DB_TYPE');

                const config: TypeOrmModuleOptions = {
                    type,
                    host,
                    port,
                    username,
                    password,
                    database,
                    synchronize,
                    logging,
                    entities,
                    migrationsTableName,
                    ssl: true,
                    namingStrategy: new TypeORMCustomNamingStrategy(),
                };

                return config;
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [MigrationController],
    providers: [MigrationFactory, MigrationsService],
})
export class DatabaseModule {}
