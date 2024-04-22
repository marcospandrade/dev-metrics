import { TestBed } from '@automock/jest';

import { FormatResponseInterceptor } from './format-response.interceptor';

describe('FormatResponseInterceptor', () => {
    let interceptor: FormatResponseInterceptor;

    beforeEach(async () => {
        interceptor = TestBed.create(FormatResponseInterceptor).compile().unit;
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });
});
