import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class SyncIntegrationProjectCommand {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;
}

export class SyncIntegrationProjectWithoutEmailCommand extends OmitType(SyncIntegrationProjectCommand, ['userEmail']) {}
