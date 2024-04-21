import { QueryRunnerWithModuleRef } from '../types/query-runner-with-module-ref';
import { DatabaseMigration } from '../types/database-migration';

export default class CreateFirstVendors1712935757566 implements DatabaseMigration {
    requiredForAppInitialization = true;
    public async up(queryRunner: QueryRunnerWithModuleRef): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "vendors" (id, name, status, key) VALUES ('d8c65404-8e92-4fc8-a72b-733f7bcf7712', 'IDT', DEFAULT, 'idt'), ('0e23aeb0-4087-4c77-89fc-2556e68f0683', 'Twist', DEFAULT, 'twist')`,
        );
        return await queryRunner.query(
            `INSERT INTO "orders" (id, name, status, "vendorId") VALUES (DEFAULT, 'order 1', 'started', '0e23aeb0-4087-4c77-89fc-2556e68f0683'), (DEFAULT, 'order 2', 'in_progress', '0e23aeb0-4087-4c77-89fc-2556e68f0683'), (DEFAULT, 'order 3', 'started', 'd8c65404-8e92-4fc8-a72b-733f7bcf7712')`,
        );
    }

    public async down(queryRunner: QueryRunnerWithModuleRef): Promise<void> {}
}
