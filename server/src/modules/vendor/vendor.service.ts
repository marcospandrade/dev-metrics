import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
    public constructor(@InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>) {}

    public getVendors() {
        return this.vendorRepository.find();
    }
}
