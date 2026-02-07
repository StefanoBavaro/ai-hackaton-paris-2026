import { Database } from 'duckdb';
import { promisify } from 'util';

let db: Database | null = null;

export async function getDb() {
    if (!db) {
        db = new Database('finance.db');
    }
    return db;
}

export async function queryDb<T>(sql: string): Promise<T[]> {
    const connection = await getDb();
    const run = promisify(connection.all.bind(connection));
    return run(sql) as Promise<T[]>;
}
