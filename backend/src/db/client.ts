import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const config = {
    user: process.env.PG_USER || '',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.DB_NAME || 'recipehub',
    password: process.env.PG_PASSWORD || '',
    port: parseInt(process.env.PG_PORT || '5432')
};

// Prevent logging and connection when in test environment
if (process.env.NODE_ENV !== 'test') {
    console.log('Logging into postgres with following config:', {...config, password: '***REDACTED***'});
}

let sequelize: Sequelize | null = null;

if (process.env.NODE_ENV !== 'test') {
    sequelize = new Sequelize({
        dialect: 'postgres',
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.user,
        password: config.password,
        logging: console.log,
        define: {
            underscored: true // Automatically map camelCase attributes to snake_case columns
        }
    });
    

    sequelize.authenticate()
        .then(() => console.log('Logging into postgres with following config:', {...config, password: '***REDACTED***'}))
        .catch(err => console.error('Database connection failed:', err));
}

export default sequelize!;
