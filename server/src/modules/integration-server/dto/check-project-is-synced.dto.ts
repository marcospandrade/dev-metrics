import { IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { IntegrationServer } from '../entities/integration-server.entity';

export class CheckProjectIsSyncedDTO {
    @IsBoolean()
    synced: boolean;

    @IsObject()
    @ValidateNested()
    project: IntegrationServer;
}
