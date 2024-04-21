import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'name',
    })
    name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'vendor id',
    })
    vendorId: string;
}
