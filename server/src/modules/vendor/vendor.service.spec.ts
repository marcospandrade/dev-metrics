import { TestBed } from '@automock/jest';

import { VendorService } from './vendor.service';

describe('VendorService', () => {
    let service: VendorService;

    beforeAll(() => {
        service = TestBed.create(VendorService).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
