import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'crypto';

export class TypeORMCustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    foreignKeyName(
        tableOrName: Table | string,
        columnNames: string[],
        referencedTablePath?: string,
        referencedColumnNames?: string[],
    ): string {
        tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

        const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}_${referencedTablePath}`);

        if (tableOrName === 'sprints') console.log({ tableOrName });
        return `fk_${crypto.createHash('md5').update(name).digest('hex')}_${name}`;
    }
}
