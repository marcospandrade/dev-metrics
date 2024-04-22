import { TestBed } from '@automock/jest';

import { AxiosFilter } from './axios.filter';

describe('AxiosFilter', () => {
    let filter: AxiosFilter;

    beforeEach(async () => {
        filter = TestBed.create(AxiosFilter).compile().unit;
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });
});
