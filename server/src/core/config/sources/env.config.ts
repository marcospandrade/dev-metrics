import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export type Environment = 'local' | 'dev' | 'production' | 'test';

class BuildConfig {
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    /** The port to start the nest server */
    APP_PORT!: number;
}

/** All values required here should be listed in your .env file */
export class BaseEnvConfig extends IntersectionType(BuildConfig) {
    @IsNotEmpty()
    @IsIn(['local', 'dev', 'test', 'production'])
    /** The environment configuration, will default to `dev` */
    NODE_ENV!: Environment;

    @IsNotEmpty()
    @IsString()
    /** The lowercase name of the app, in snake case */
    APP_NAME!: string;

    @IsNotEmpty()
    @IsString()
    URL_FRONT!: string;
}
