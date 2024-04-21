import { Controller, Get } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendors')
export class VendorController {
    public constructor(private readonly vendorService: VendorService) {}

    @Get()
    public getVendors() {
        return this.vendorService.getVendors();
    }
}
