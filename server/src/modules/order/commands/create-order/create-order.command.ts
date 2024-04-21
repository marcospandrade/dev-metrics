import { IsString } from 'class-validator';

export class CreateOrderCommand {
    @IsString()
    name: string;

    @IsString()
    vendorId: string;
}
