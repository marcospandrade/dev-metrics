import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [TypeOrmModule.forFeature([Vendor]), CqrsModule],
    controllers: [VendorController],
    providers: [VendorService],
})
export class VendorModule {}
