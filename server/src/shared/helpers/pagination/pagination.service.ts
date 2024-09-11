import { FindOptionsWhere, Repository } from 'typeorm';

import { GenericQueryDto, SortOrder } from './query';

export class PaginationService {
    protected createOrderQuery(filter: GenericQueryDto) {
        const order: any = {};

        if (filter.orderBy) {
            order[filter.orderBy] = filter.sortOrder;
            return order;
        }

        order.createdAt = SortOrder.DESC;
        return order;
    }

    protected paginate<T>(repository: Repository<T>, filter: GenericQueryDto, where: FindOptionsWhere<T>) {
        return repository.findAndCount({
            order: this.createOrderQuery(filter),
            skip: (filter.page - 1) * filter.pageSize,
            take: filter.pageSize,
            where: where,
        });
    }
}
