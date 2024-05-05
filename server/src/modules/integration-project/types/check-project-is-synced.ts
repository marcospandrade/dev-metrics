import { IntegrationProject } from '../entities/integration-project.entity';

export type TCheckProjectIsSynced = {
    synced: boolean;
    project: IntegrationProject;
};
