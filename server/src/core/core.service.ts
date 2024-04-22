import { Injectable } from '@nestjs/common';
import {
    GlobalPrefixOptions,
    INestApplication,
    NestApplicationOptions,
    VersioningOptions,
} from '@nestjs/common/interfaces';
import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { ObjValidator } from './config/obj-validator';
import { BaseEnvConfig } from './config/sources/env.config';
import { BaseNatsConfig } from './config/sources/nats.config';
import { DocumentBuilder } from '@nestjs/swagger';

export interface CoreModuleOptions {
    /**
     * @property appModule - Entry (root) application module class.
     * @example  AppModule
     */
    appModule: any;
    /**
     * @property appOptions - Optional application options.
     * @example { rawBody: true }
     */
    appOptions?: NestApplicationOptions;
    /**
     * @example app.useGlobalFilters(new ExceptionFilter())
     */
    globalFilters?: Parameters<INestApplication['useGlobalFilters']>;
    /**
     * @example app.useGlobalInterceptors(new TransformInterceptor())
     */
    globalInterceptors?: Parameters<INestApplication['useGlobalInterceptors']>;
    /**
     * @example app.useGlobalPipes(new ValidationPipe())
     */
    globalPipes?: Parameters<INestApplication['useGlobalPipes']>;
    /**
     * @param prefix — The prefix for every HTTP route path.
     * @example 'api'
     * @param prefixOptions - Optional options for the global prefix.
     * @example { exclude: ['health-check', 'version'] }
     */
    globalPrefix?: {
        prefix: string;
        prefixOptions?: GlobalPrefixOptions;
    };
    /**
     *  @example [logger]
     */
    middlewares?: any[];

    /**
     * @property configureDocumentBuilder - Function to configure the Swagger document builder.
     * @example (documentBuilder) => documentBuilder.setTitle('Example').setVersion('1.0')
     * @property path - Path where Swagger UI will be hosted.
     * @example 'api/docs'
     */
    swaggerOptions?: {
        configureDocumentBuilder: (documentBuilder: DocumentBuilder) => DocumentBuilder;
        path: string;
    };

    /**
     * @property versioningOptions - Optional versioning options.
     * @example { type: VersioningType.URI, defaultVersion: '0' }
     */
    versioningOptions?: VersioningOptions;

    /**
     * @property useNats - Enable/disable Nats microservice. If you import the NatsModule you need this.
     */
    useNats: boolean;
}

@Injectable()
export class CoreService {
    static customHealthIndicators: any[] = [];
    static async bootstrap(options: CoreModuleOptions) {
        // Validate environment variables
        const { APP_PORT, URL_FRONT, NODE_ENV } = ObjValidator.forEnv(BaseEnvConfig);

        // Create NestJS application
        const app = await NestFactory.create(options.appModule, options.appOptions);

        // Apply Pino logger to NestJS build-in logger
        app.useLogger(app.get(Logger));

        // Set up global prefix
        if (options.globalPrefix) {
            const { prefix, prefixOptions } = options.globalPrefix;
            app.setGlobalPrefix(prefix, prefixOptions);
        }

        // app.enableVersioning(options.versioningOptions);

        // Apply middlewares
        if (options.middlewares) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            app.use(...options.middlewares);
        }

        if (options.globalInterceptors) {
            app.useGlobalInterceptors(...options.globalInterceptors);
        }

        if (options.globalPipes) {
            app.useGlobalPipes(...options.globalPipes);
        }

        // Apply global filters to catch all exceptions not handled by the application
        // these will override the APP_FILTER providers
        if (options.globalFilters) {
            app.useGlobalFilters(...options.globalFilters);
        }

        if (options.useNats) {
            app.connectMicroservice(BaseNatsConfig.getNatsClientConfig());
        }

        // app.enableShutdownHooks();

        const allowedOrigins = [`http://localhost:${APP_PORT}`];

        if (NODE_ENV !== 'production') {
            allowedOrigins.push(URL_FRONT);
        }

        app.enableCors({
            origin: allowedOrigins,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        });

        // await app.startAllMicroservices();

        await app.listen(APP_PORT || 3000);
    }
}
