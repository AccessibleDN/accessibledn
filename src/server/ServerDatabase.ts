import { createConnection } from 'mysql2/promise';
import Database from 'better-sqlite3';
import { AuthenticationDatabaseType, MySQLAuthenticationDatabaseConfiguration, SQLiteAuthenticationDatabaseConfiguration } from '~/utils/types';

export class ServerDatabase {
    private static instance: ServerDatabase;
    private sqliteDb?: Database.Database;
    private mysqlPool?: any;
    private dbType: AuthenticationDatabaseType;
    private config: MySQLAuthenticationDatabaseConfiguration | SQLiteAuthenticationDatabaseConfiguration;

    private constructor(config: MySQLAuthenticationDatabaseConfiguration | SQLiteAuthenticationDatabaseConfiguration) {
        this.dbType = config.type;
        this.config = config;
    }

    public static async getInstance(config: MySQLAuthenticationDatabaseConfiguration | SQLiteAuthenticationDatabaseConfiguration): Promise<ServerDatabase> {
        if (!ServerDatabase.instance) {
            ServerDatabase.instance = new ServerDatabase(config);
            await ServerDatabase.instance.initialize();
        }
        return ServerDatabase.instance;
    }

    private async initialize(): Promise<void> {
        if (this.dbType === 'sqlite') {
            const dbPath = process.env.SQLITE_PATH || 'Main.sqlite';
            this.sqliteDb = new Database(dbPath);
        } else {
            this.mysqlPool = await createConnection({
                host: process.env.MYSQL_HOST || 'localhost',
                port: parseInt(process.env.MYSQL_PORT || '3306'),
                user: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASSWORD || '',
                database: process.env.MYSQL_DATABASE || 'accessibledn'
            });
        }
    }

    public async query<T>(sql: string, params: any[] = []): Promise<T> {
        if (this.dbType === 'sqlite') {
            const stmt = this.sqliteDb!.prepare(sql);
            return stmt.all(...params) as T;
        } else {
            const [rows] = await this.mysqlPool!.execute(sql, params);
            return rows as T;
        }
    }

    public async exec(sql: string, params: any[] = []): Promise<boolean> {
        if (this.dbType === 'sqlite') {
            const stmt = this.sqliteDb!.prepare(sql);
            const result = stmt.run(...params);
            return result.changes > 0;
        } else {
            const [result] = await this.mysqlPool!.execute(sql, params);
            return result.affectedRows > 0;
        }
    }

    public async close(): Promise<void> {
        if (this.dbType === 'sqlite') {
            this.sqliteDb?.close();
        } else {
            await this.mysqlPool?.end();
        }
    }
}
