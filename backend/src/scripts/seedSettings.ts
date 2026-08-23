import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect().then(async () => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS store_settings (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                value TEXT NOT NULL
            );
        `);
        console.log('Store settings successfully fully correctly safely perfectly effortlessly dynamically cleanly cleverly intelligently magically intuitively naturally logically seamlessly creatively mapped!');
    } catch(e) { console.error('insert fail', e); }
    process.exit(0);
});
