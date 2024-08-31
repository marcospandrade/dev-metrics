import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

import { RegisterCustomFieldsCommand } from './register-custom-fields.command';
import { SchemaValidator } from '@core/utils';
import { SearchCustomFieldQuery } from '@modules/integration-server/queries/search-custom-field/search-custom-field.query';
import { CustomFieldsUseCases } from '@modules/integration-server/use-cases/custom-fields.use-cases.service';
import { AtlassianCustomType } from '@lib/atlassian/types/atlassian-custom-field.type';
import { PaginatedResponse } from '@lib/atlassian/types/paginated-response.type';
import { UpsertCustomFieldDto } from '@modules/integration-server/dto/upsert-custom-field.dto';
import { UpsertRawProjectsEvent } from '@modules/integration-server/events/upsert-raw-projects.event';

@CommandHandler(RegisterCustomFieldsCommand)
export class RegisterCustomFieldsHandler implements ICommandHandler<RegisterCustomFieldsCommand> {
    public constructor(
        private readonly configService: ConfigService,
        private readonly eventBus: EventBus,
        private readonly queryBus: QueryBus,
        private readonly customFieldUseCases: CustomFieldsUseCases,
    ) {}

    async execute(command: RegisterCustomFieldsCommand): Promise<void> {
        const relevantFields = this.configService.get<string>('RELEVANT_FIELDS').split(',');

        const promisesAtlassianFields = relevantFields.map(field => {
            return this.queryBus.execute<SearchCustomFieldQuery, PaginatedResponse<AtlassianCustomType>>(
                SchemaValidator.toInstance(
                    { cloudId: command.serverExternalId, userEmail: command.userEmail, fieldName: field },
                    SearchCustomFieldQuery,
                ),
            );
        });

        const queriedAtlassianFields = await Promise.all(promisesAtlassianFields);

        await this.customFieldUseCases.upsertCustomField(
            this.mountUpsertCustomFieldPayload(queriedAtlassianFields, command.serverInternalId),
        );

        return this.eventBus.publish<UpsertRawProjectsEvent, void>(
            SchemaValidator.toInstance(command, UpsertRawProjectsEvent),
        );
    }

    private mountUpsertCustomFieldPayload(
        payload: PaginatedResponse<AtlassianCustomType>[],
        internalIntegrationServerId: string,
    ): UpsertCustomFieldDto[] {
        return payload.map(obj => {
            const value = obj.values[0];
            return {
                atlassianId: value.id,
                integrationServerId: internalIntegrationServerId,
                name: value.name,
                type: value.schema.type,
            };
        });
    }
}
