import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomFields } from '../entities/custom-fields.entity';
import { Repository } from 'typeorm';
import { UpsertCustomFieldDto } from '../dto/upsert-custom-field.dto';

@Injectable()
export class CustomFieldsUseCases {
    public constructor(
        @InjectRepository(CustomFields)
        private readonly customFieldRepository: Repository<CustomFields>,
    ) {}

    async upsertCustomField(payload: UpsertCustomFieldDto | UpsertCustomFieldDto[]) {
        return this.customFieldRepository.upsert(payload, {
            skipUpdateIfNoValuesChanged: true,
            conflictPaths: ['atlassianId', 'projectId'],
        });
    }

    async getCustomFieldIds(internalServerId: string) {
        return this.customFieldRepository.find({
            where: {
                project: {
                    integrationServerId: internalServerId,
                },
            },
        });
    }

    createCustomFieldMap(customFields: CustomFields[]) {
        const customFieldsMap = new Map<string, string>();
        customFields.forEach(cf => {
            customFieldsMap.set(cf.atlassianId, cf.name);
        });

        return customFieldsMap;
    }
}
