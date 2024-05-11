import { IntegrationServer } from '@modules/integration-server/entities/integration-server.entity';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject } from 'class-validator';

export class SyncIntegrationProjectCommand {
    @IsBoolean()
    synced: boolean;

    @IsObject({ each: true })
    @Type(() => IntegrationServer)
    project: IntegrationServer;
}
