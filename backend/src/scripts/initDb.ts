import { Pool } from 'pg';
import { pool } from '../config/db';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const createDatabaseIfNotExists = async () => {
    const sysPool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: 'postgres' // Connect to default postgres database to run CREATE DATABASE
    });

    try {
        const res = await sysPool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'nation_supermarket'`);
        if (res.rowCount === 0) {
            console.log('📦 Database "nation_supermarket" not found. Creating it now...');
            await sysPool.query('CREATE DATABASE nation_supermarket');
            console.log('✅ Database "nation_supermarket" created successfully.');
        } else {
            console.log('📦 Database "nation_supermarket" already exists.');
        }
    } catch (e) {
        console.error('Error checking/creating database:', e);
    } finally {
        await sysPool.end();
    }
}

const initDatabase = async () => {
    try {
        // Step 1: Create the database itself if missing
        await createDatabaseIfNotExists();
        
        // Step 2: Connect to nation_supermarket and create tables
        console.log('⏳ Initializing tables...');
        
        const schemaPath = path.join(process.cwd(), 'src/config/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('⚙️ Running schema setup against PostgreSQL...');
        await pool.query(schema);
        
        console.log('✅ Database initialization complete! All 12 tables have been structured.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database Initialization Failed:', error);
        process.exit(1);
    }
};

initDatabase();
