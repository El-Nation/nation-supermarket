import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
});

client.connect().then(async () => {
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'");
    console.log(res.rows);
    process.exit(0);
});
