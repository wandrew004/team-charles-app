import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
    user: process.env.PG_USER || "",
    host: process.env.PG_HOST || "localhost",
    database: process.env.DB_NAME || "recipehub",
    password: process.env.PG_PASSWORD || "",
    port: parseInt(process.env.PG_PORT || "5432")
}

console.log("Logging into postgres with following config:", { ...config, password: "***REDACTED***" });

const pool: Pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
});
export default pool;

export const queryDatabase = <T>(query: string, params?: any[]): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        pool.query(query, params || [], (error, results) => {
            if (error) {
                return reject(error);
            }
            
            resolve(results?.rows || []);
        });
    });
};
