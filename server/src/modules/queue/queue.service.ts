import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { JsMsgImpl } from 'nats/lib/jetstream/jsmsg';
import { Observable, concatMap, finalize, from, map, switchMap, take, tap } from 'rxjs';
import { LoggerService } from '@core/logger/logger.service';
import { CustomClientNats, KV, NatsError } from '@core/nats/nats-client.proxy';

import { QUEUE_REQUEST_TOPIC } from './constants/event-handler-topics';
import { QueueRequestOptions } from './types/queue-request-options';
import { ConfigService } from '@nestjs/config';
import { ServerAppConfig } from 'src/app.module';
import { QueueIncomingMessageEvent } from './events/queue-incoming-message.event';
import { SchemaValidator } from '@core/utils';

export const INCOMING_ORDER_EVENTS_QUEUE = 'order-events';
export const ORCHESTRATOR_KEY = 'orchestrator';
export const INCOMING_ORDER_EVENTS_QUEUE_PATTERN = '.>';
export const INCOMING_ORDER_EVENTS_QUEUE_CONSUMER_NAME = 'orchestrator-server-consumer';

@Injectable()
export class QueueService {
    private ordersKv: KV;

    constructor(
        private readonly client: CustomClientNats,
        private readonly eventsBus: EventBus,
        private readonly logger: LoggerService,
        private readonly configService: ConfigService<ServerAppConfig>,
    ) {}

    async onApplicationBootstrap() {
        const USE_NATS = this.configService.get('USE_NATS');
        if (!USE_NATS) {
            this.logger.info('NATS is not enabled');
            return;
        }

        this.logger.info('NATS is enabled');

        this.processQueueMessages(INCOMING_ORDER_EVENTS_QUEUE, INCOMING_ORDER_EVENTS_QUEUE_CONSUMER_NAME).subscribe();

        this.client
            .createKeyValueStore$('event-stack-status-update', {
                history: 1,
            })
            .pipe(take(1))
            .subscribe();

        await this.createOrdersKv();
    }

    @OnEvent('PUBLISH_ORDERS_KV')
    async publishTriggerJobsKv(data: any[], key = 'pending_orders') {
        const kv = await this.createOrdersKv();

        this.logger.info(`Publishing ${data.length} orders to ${key}`);

        const entry = await kv.get(key);
        const existing = entry?.json();
        const newBucketData = new Map();

        this.logger.info(existing, `Existing KV for orders`);

        if (existing && Array.isArray(existing)) {
            for (const order of existing) {
                newBucketData.set(order.id, order);
            }
        }

        for (const order of data) {
            const entry = newBucketData.get(order.id);

            if (entry) {
                newBucketData.set(order.id, { ...entry, ...order });
            } else {
                newBucketData.set(order.id, order);
            }
        }

        await kv.put(key, JSON.stringify(Array.from(newBucketData.values())));
    }

    private async createOrdersKv() {
        if (!this.ordersKv) {
            this.ordersKv = await this.client.createKeyValueStore('orders_kv', {
                history: 1,
            });
        }

        return this.ordersKv;
    }

    async onApplicationShutdown() {
        this.logger.info('Shutting down queue service');

        await this.client.close();
    }

    public publish(queueName: string, data?: any) {
        return this.client.emit(queueName, data);
    }

    @OnEvent(QUEUE_REQUEST_TOPIC)
    public async request<Response extends object>(requestConfig: QueueRequestOptions) {
        if (!requestConfig.opts || typeof requestConfig.opts !== 'object') {
            requestConfig.opts = {
                reply: crypto.randomUUID(),
            };
        }

        if (!requestConfig.data.replyOn) {
            requestConfig.data.replyOn = requestConfig.opts.reply;
        }

        return this.client
            .request<Response>(requestConfig.queueName, requestConfig.data, requestConfig.opts)
            .catch((e: NatsError) => {
                if (e && e.message && e.message !== '503') {
                    this.logger.error(e, 'Error requesting queue');
                } else if (e?.message === '503') {
                    this.logger.info(`Queue endpoint "${requestConfig.queueName}" is not available`);
                }

                return { error: 'Resource is not available' };
            });
    }

    public processQueueMessages(streamName: string, consumerName: string) {
        return from(
            this.client.registerAndConsumeJetstreamQueue(
                {
                    name: streamName,
                    subjects: [streamName + INCOMING_ORDER_EVENTS_QUEUE_PATTERN],
                },
                consumerName,
            ),
        ).pipe(
            switchMap(async consumer => {
                // consumer is an AsyncIterable, so here we are converting it to an Observable
                const messages = await consumer.consume();

                return new Observable(observer => {
                    (async () => {
                        for await (const m of messages) {
                            this.logger.debug('Received message from Jetstream consumer');
                            observer.next(m);
                        }
                    })();

                    return () => {
                        this.logger.debug('Unsubscribing from Jetstream consumer');
                        messages.stop();
                    };
                });
            }),

            // subscribe to the observable returned by the previous switchMap
            concatMap($ => $),

            map(v => v as JsMsgImpl),

            switchMap(async msg => {
                const pattern = msg.subject;

                this.logger.info({
                    msg: 'Incoming queue msg',
                    pattern,
                });

                if (!pattern) {
                    this.logger.warn({
                        msg: 'Unmapped queue msg. Terminating so it can be requeued.',
                        pattern,
                    });

                    msg.term();

                    return;
                }

                const queueEvent = SchemaValidator.toInstance(
                    {
                        ...(msg.json() as any),
                        eventPattern: pattern,
                    },
                    QueueIncomingMessageEvent,
                );

                let hasValidSchema = false;
                try {
                    SchemaValidator.validate(queueEvent, QueueIncomingMessageEvent);
                    hasValidSchema = true;
                } catch (error) {
                    this.logger.error(error, `Invalid queue event`);
                }

                if (!hasValidSchema) {
                    msg.term('INVALID_SCHEMA');
                    return;
                }

                this.logger.info({
                    msg: 'Processing orders queue msg',
                    pattern,
                    sequence: msg.seq,
                    isRedelivedMessage: msg.redelivered,
                    queueEvent,
                });

                msg.working();

                this.eventsBus.publish(queueEvent);

                return msg;
            }),

            tap(msg => {
                if (msg) {
                    // done processing, ack the message
                    this.logger.info('Message processed!');
                    msg.ack();
                }
            }),

            finalize(() => this.logger.info(`Closing queue for ${streamName}`)),
        );
    }
}
