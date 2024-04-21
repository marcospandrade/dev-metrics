import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NatsOptions } from '@nestjs/microservices';
import { ObjValidator } from '../obj-validator';

type NatsConfig = NatsOptions['options'];

export class BaseNatsConfig {
    @IsNotEmpty()
    @IsString()
    NATS_PORT = 4222;

    @IsOptional()
    @IsString()
    NATS_NAME = 'NATS_SERVICE';

    @IsNotEmpty()
    @IsString()
    NATS_HOST!: string;

    @IsNotEmpty()
    @IsString()
    NATS_PASS!: string;

    @IsNotEmpty()
    @IsString()
    NATS_USER!: string;

    @IsOptional()
    @IsString()
    NATS_TOKEN?: string;

    @IsOptional()
    @IsBoolean()
    NATS_USE_TLS?: boolean;

    @IsOptional()
    @IsBoolean()
    USE_NATS?: boolean;

    static getNatsClientConfig(conf?: Partial<NatsConfig>): NatsConfig {
        const { NATS_HOST, NATS_PORT, NATS_USER, NATS_PASS, NATS_TOKEN, NATS_NAME } =
            ObjValidator.forEnv(BaseNatsConfig);

        const baseServerUrl = `nats://${NATS_HOST.replace('nats://', '')}:${NATS_PORT}`;

        return {
            name: NATS_NAME,
            userJWT: NATS_TOKEN,
            user: NATS_USER,
            pass: NATS_PASS,
            servers: [baseServerUrl, ...(conf?.additionalServers || [])],
            maxReconnectAttempts: -1,
            ...(conf && conf),
        };
    }
}
