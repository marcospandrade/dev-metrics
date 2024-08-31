install-deps: 
	bash ./scripts/install.sh

clean-deps:
	bash ./scripts/remove.sh

up:
	docker compose --env-file ./server/.env up -d --remove-orphans

stop:
	docker compose --env-file ./server/.env stop
	
down:
	docker compose --env-file ./server/.env down

clean: down prune

prune:
	docker rmi dev-metrics-server -f \

local:
	docker compose --env-file ./server/.env up -d postgres --remove-orphans;
	NATS_HOST=localhost \
	DB_HOST=localhost \
	npm --prefix ./server run start:dev

install-nats:
	brew tap nats-io/nats-tools;
	brew install nats-io/nats-tools/nats;
	
	nats ctx save orchestrator-cli;
	nats ctx select orchestrator-cli;

	sh ./scripts/nats-cli-config.sh;

publish-nats:
	nats pub idt.create-order --count 5000 '{"pattern": "idt.create-order.52dc2c31-8efa-4a76-b1a6-7be48c2a844b","data": {"eventStackId": "abbd6d84-429e-4931-b626-44a851adb1e3","eventStacksName": "create-order","entityId": "52dc2c31-8efa-4a76-b1a6-7be48c2a844b","metadata": "{\"id\":\"52dc2c31-8efa-4a76-b1a6-7be48c2a844b\",\"createdAt\":\"2024-04-16T17:51:31.375Z\",\"updatedAt\":\"2024-04-16T17:51:31.375Z\",\"deletedAt\":null,\"name\":\"order test 123\",\"status\":\"started\",\"purchaseOrderId\":null,\"vendorId\":\"d8c65404-8e92-4fc8-a72b-733f7bcf7712\",\"vendor\":{\"id\":\"d8c65404-8e92-4fc8-a72b-733f7bcf7712\",\"createdAt\":\"2024-04-15T20:56:02.010Z\",\"updatedAt\":\"2024-04-15T20:56:02.010Z\",\"deletedAt\":null,\"name\":\"IDT\",\"status\":\"ENABLED\",\"key\":\"idt\"}}","eventKey": "idt"}}'