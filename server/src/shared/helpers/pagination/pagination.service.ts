import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';

import { GenericQueryDto, SortOrder } from './query';

export class PaginationService {
    protected createOrderQuery(filter: GenericQueryDto) {
        const order: any = {};

        if (filter.orderBy) {
            order[filter.orderBy] = filter.sortOrder;
            return { sort: filter.orderBy, order: filter.sortOrder };
        }

        return { sort: '"createdAt"', order: SortOrder.DESC };
    }

    protected async paginate<T>(
        queryBuilder: SelectQueryBuilder<T>, // Accept the QueryBuilder directly
        filter: GenericQueryDto,
    ) {
        const page = filter.page || 1;
        const pageSize = filter.pageSize || 10;
        const { sort, order } = this.createOrderQuery(filter);

        const [result, total] = await queryBuilder
            .orderBy(sort, order)
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return {
            data: result,
            count: total,
        };
    }

    protected createQueryBuilderWithFilters<T>(
        identifier: string,
        idFieldName: keyof T,
        searchText: string,
        params: string[],
        repository: Repository<T>,
    ) {
        const query = repository
            .createQueryBuilder('entity')
            .where(`entity.${String(idFieldName)} = :identifier`, { identifier });

        if (params.length > 0 && searchText) {
            query.andWhere(
                new Brackets(qb => {
                    params.forEach((key, index) => {
                        if (index === 0) {
                            qb.where(`entity.${key} ILIKE :searchText`, { searchText: `%${searchText}%` });
                        } else {
                            qb.orWhere(`entity.${key} ILIKE :searchText`, { searchText: `%${searchText}%` });
                        }
                    });
                }),
            );
        }

        return query;
    }
}
