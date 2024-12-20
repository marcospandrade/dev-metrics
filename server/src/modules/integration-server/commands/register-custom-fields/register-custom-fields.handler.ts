import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { RegisterCustomFieldsCommand } from './register-custom-fields.command';
import { SchemaValidator } from '@core/utils';
import { CustomFieldsUseCases } from '@modules/integration-server/use-cases/custom-fields.use-cases.service';
import { UpsertCustomFieldDto } from '@modules/integration-server/dto/upsert-custom-field.dto';
import { CheckSyncProjectEvent } from '@modules/integration-server/events/check-sync-project.event';
import { ProjectUseCases } from '@modules/integration-server/use-cases/projects.use-cases.service';

@CommandHandler(RegisterCustomFieldsCommand)
export class RegisterCustomFieldsHandler implements ICommandHandler<RegisterCustomFieldsCommand> {
    public constructor(
        private readonly eventBus: EventBus,
        private readonly customFieldUseCases: CustomFieldsUseCases,
        private readonly projectsUseCases: ProjectUseCases,
    ) {}

    async execute(command: RegisterCustomFieldsCommand): Promise<void> {
        const fieldsToRegister: UpsertCustomFieldDto[] = command.fieldsToRegister.map(field => {
            return SchemaValidator.toInstance(
                {
                    atlassianId: field.atlassianId,
                    projectId: command.projectId,
                    name: field.fieldName,
                    type: field.fieldType,
                    isStoryPointField: field.isStoryPointField,
                },
                UpsertCustomFieldDto,
            );
        });

        await Promise.all([
            await this.customFieldUseCases.upsertCustomField(fieldsToRegister),
            await this.projectsUseCases.updateOne(command.projectId, {
                isCustomFieldSelected: true,
            }),
        ]);

        return this.eventBus.publish<CheckSyncProjectEvent, void>(
            SchemaValidator.toInstance(
                { projectId: command.projectId, userEmail: command.userEmail },
                CheckSyncProjectEvent,
            ),
        );
    }
}
