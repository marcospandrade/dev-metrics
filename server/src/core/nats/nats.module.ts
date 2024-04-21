import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NatsOptions } from '@nestjs/microservices';

import { CustomClientNats } from './nats-client.proxy';
import { ConfigService } from '@nestjs/config';
import { OrchestratorAppConfig } from 'src/app.module';
import { BaseNatsConfig } from '@core/config/sources/nats.config';

type NatsConfig = NatsOptions['options'];

@Module({})
export class NatsModule {
    static register(config?: NatsConfig): DynamicModule {
        return {
            global: true,
            module: NatsModule,
            providers: [NatsModule.provideNatsClient(config)],
            exports: [CustomClientNats],
        };
    }

    private static provideNatsClient(config?: NatsConfig): Provider {
        return {
            provide: CustomClientNats,
            useFactory: (configSvc: ConfigService<OrchestratorAppConfig>) => {
                return new CustomClientNats(BaseNatsConfig.getNatsClientConfig(config));
            },
            inject: [ConfigService],
        };
    }
}
