import { RequestOptions } from 'nats';

export interface QueueRequestOptions {
    queueName: string;
    data: Record<string, any>;
    opts?: Partial<RequestOptions>;
}
