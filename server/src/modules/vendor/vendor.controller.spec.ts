import { TestBed } from '@automock/jest';

import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

describe('VendorController', () => {
    let controller: VendorController;

    beforeEach(async () => {
        controller = TestBed.create(VendorController).mock(VendorService).using({}).compile().unit;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
