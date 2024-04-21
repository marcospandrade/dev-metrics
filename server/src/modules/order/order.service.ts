import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Raw, Repository } from 'typeorm';

import { QueryDto } from '@core/models/query';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

    async createOrder(orderDto: CreateOrderDto) {
        const order = this.orderRepository.create({ ...orderDto });
        const newOrder = await this.orderRepository.save(order);
        return this.readSingleOrder(newOrder.id);
    }

    async readOrders({ page = 1, pageSize = 20, text }: QueryDto) {
        const where: FindOptionsWhere<any> = {};
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;

        if (text) where.name = Raw((alias) => `${alias} ~* :pattern`, { pattern: text });

        const query: FindManyOptions<Order> = {
            skip,
            take,
            where,
            order: { createdAt: 'desc' },
            relations: { vendor: true },
        };

        const [records, total] = await this.orderRepository.findAndCount(query);

        return { records, total };
    }

    readSingleOrder(orderId: string) {
        return this.orderRepository.findOne({ where: { id: orderId }, relations: { vendor: true } });
    }

    async updateOrder(orderId: string, orderDto: Partial<Order>) {
        await this.orderRepository.update({ id: orderId }, orderDto);
        return this.readSingleOrder(orderId);
    }
}
