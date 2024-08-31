import { IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';

import { Project } from '../entities/project.entity';

export class CheckProjectIsSyncedDTO {
    @IsBoolean()
    synced: boolean;

    @IsObject()
    @ValidateNested()
    project: Project;

    @IsString()
    integrationServerId: string;
}
