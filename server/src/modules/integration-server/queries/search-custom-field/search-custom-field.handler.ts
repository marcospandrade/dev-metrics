import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchCustomFieldQuery } from './search-custom-field.query';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { SchemaValidator } from '@core/utils';
import { SearchFieldByNameDto } from '@lib/atlassian/dto/search-field-by-name.dto';
import { LoggerService } from '@core/logger/logger.service';
import { PaginatedResponse } from '@lib/atlassian/types/paginated-response.type';
import { AtlassianCustomType } from '@lib/atlassian/types/atlassian-custom-field.type';

@QueryHandler(SearchCustomFieldQuery)
export class SearchCustomFieldQueryHandler
    implements IQueryHandler<SearchCustomFieldQuery, PaginatedResponse<AtlassianCustomType>>
{
    public constructor(
        private readonly atlassianUseCases: AtlassianUseCases,
        private readonly logger: LoggerService,
    ) {}

    async execute(query: SearchCustomFieldQuery) {
        this.logger.info(`Search field ${query.fieldName} into Atlassian Server`);
        const fieldNameObject = await this.atlassianUseCases.searchByFieldName(
            SchemaValidator.toInstance(query, SearchFieldByNameDto),
        );

        if (fieldNameObject.total > 1) {
            return {
                ...fieldNameObject,
                values: [fieldNameObject.values[0]],
            };
        }

        return fieldNameObject;
    }
}
