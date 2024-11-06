import { TestBed } from '@automock/jest';

import { QueryFailedFilter } from './query-failed.filter';

describe('QueryFailedFilter', () => {
    let filter: QueryFailedFilter;

    beforeEach(async () => {
        filter = TestBed.create(QueryFailedFilter).compile().unit;
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });
});
