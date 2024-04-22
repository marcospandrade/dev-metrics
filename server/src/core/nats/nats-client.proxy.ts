import { ClientNats } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import {
    AckPolicy,
    JetStreamClient,
    JetStreamManager,
    JetStreamManagerOptions,
    JetStreamOptions,
    KV,
    KvEntry,
    KvOptions,
    Payload,
    RequestOptions,
    StreamConfig,
    NatsError,
} from 'nats';
import { Observable, concatMap, from, map, switchMap } from 'rxjs';

export type JetStreamManagerCustomOptions = JetStreamManagerOptions & {
    account: string;
    user: string;
};

export {
    AckPolicy,
    JetStreamClient,
    JetStreamManager,
    JetStreamManagerOptions,
    JetStreamOptions,
    KV,
    KvEntry,
    KvOptions,
    Payload,
    RequestOptions,
    StreamConfig,
    NatsError,
};

@Injectable()
export class CustomClientNats extends ClientNats {
    private _jetstreamManager!: JetStreamManager;
    private _jetstreamClient!: JetStreamClient;

    get nats() {
        return this.natsClient;
    }

    async onApplicationBootstrap() {
        await this.connect();
    }

    async onApplicationShutdown() {
        await this.close();
    }

    // --- /** Nats Jetstream APIs */
    public async publishToJetstreamQueue(queueName: string, data: Payload) {
        const js = await this.jetstream();

        return js.publish(queueName, data);
    }

    public async registerAndConsumeJetstreamQueue(cfg: Partial<StreamConfig>, consumerName: string) {
        const jsm = await this.jetstreamManager();

        await jsm.streams.add(cfg);

        const consumer = await this.getConsumer(cfg.name, consumerName);

        return consumer;
    }

    public async request<Response extends object>(
        subject: string,
        data: Record<string, any>,
        opts?: Partial<RequestOptions>,
    ) {
        if (typeof opts != 'object') {
            opts = {
                timeout: 10000,
                noMux: true,
            };
        }
        if (!opts.reply) {
            opts.timeout = 10000;
            opts.noMux = true;
        }

        if (!opts.timeout) {
            opts.timeout = 10000;
        }

        if (!opts.noMux) {
            opts.noMux = true;
        }

        const response = await this.nats.request(
            subject,
            new Uint8Array(Buffer.from(JSON.stringify(data))),
            opts as RequestOptions,
        );

        return JSON.parse(Buffer.from(response.data).toString()) as Response;
    }

    public async createKeyValueStore(name: string, opts: Partial<KvOptions>) {
        const js = await this.jetstream();

        return await js.views.kv(name, opts);
    }

    public createKeyValueStore$(name: string, opts: Partial<KvOptions>) {
        return from(this.jetstream()).pipe(
            switchMap(js => js.views.kv(name, opts)),
            switchMap(async kvStore => {
                const watch = await kvStore.watch();

                return new Observable(observer => {
                    observer.next({ kvStore, entryUpdate: null });

                    (async () => {
                        for await (const kv of watch) {
                            // this.logger.log(
                            //     { consumerName: name },
                            //     `Received new KV state with key ${kv.key} and operation ${kv.operation}`,
                            // );

                            observer.next({ kvStore, entryUpdate: kv });
                        }
                    })();

                    return () => {
                        this.logger.log({ consumerName: name }, `Unsubscribing from KV watch`);

                        watch.stop();
                        observer.complete();
                    };
                });
            }),

            concatMap($ => $),

            map(kv => kv as { kvStore: KV; entryUpdate: KvEntry | null }),
        );
    }

    private async jetstreamManager(opts?: JetStreamManagerCustomOptions) {
        if (this._jetstreamManager) {
            return this._jetstreamManager;
        }

        this._jetstreamManager = await this.natsClient.jetstreamManager(opts);

        return this._jetstreamManager;
    }

    private async jetstream(opts?: JetStreamOptions | undefined) {
        if (this._jetstreamClient) {
            return this._jetstreamClient;
        }

        this._jetstreamClient = this.natsClient.jetstream(opts);

        return this._jetstreamClient;
    }
    // --- /** Nats Jetstream APIs */

    // --- /** Bootstraps NATS JetStream Consumer and it's resources */
    private async getConsumer(streamName: string, consumerName: string) {
        return this.initializeConsumer(streamName, consumerName);
    }

    private async initializeConsumer(streamName: string, consumerName: string) {
        const jsm = this._jetstreamManager || (await this.jetstreamManager());

        await jsm.consumers.add(streamName, {
            durable_name: consumerName,
            ack_policy: AckPolicy.Explicit,
        });

        this.logger.log(`initialized consumer ${consumerName} for stream ${streamName}`);

        return jsm.jetstream().consumers.get(streamName, consumerName);
    }
    // --- /** Bootstraps NATS JetStream Consumer and it's resources */
}
