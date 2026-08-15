import { pool } from '../config/db';

const zones = [
    { name: 'Ugbowo / Uselu / Ring Road / Isihor / New Benin / GRA axis / Ugbor / Amagba / Ewabogun / Oguwmeyin / Okhuoromi / Aduwawa / Ugbiyokho', fee: 5000 },
    { name: 'Uselu / Ring Road / New Benin / Textile Mill Road / Oluku / Ugbowo axis / Isihor / Maingate / Uwasota / Adolor / Ekosodin / Evidence / Agen / BDPA axis', fee: 3000 },
    { name: 'Oluku (Specific)', fee: 3500 },
    { name: 'Terminal Route', fee: 4500 },
    { name: 'Ramat Park', fee: 3500 },
    { name: 'Ogida Barracks', fee: 5000 },
    { name: 'Ogheghe / Sapele Bypass', fee: 5000 },
    { name: 'Ugbowo/Uselu/Isihor -> Ring Road/New Benin/Dawson/First East Circular/Medical/Okhoro/Textile Mill Road', fee: 3000 },
    { name: 'Upper Lawani', fee: 3500 },
    { name: 'Egba / Auchi Bypass', fee: 7000 },
    { name: 'Ikueniro', fee: 6000 },
    { name: 'Agbor Bypass', fee: 6000 },
    { name: 'Idogbo', fee: 6000 },
    { name: 'Upper Sakponba', fee: 5000 },
    { name: 'Upper Mission Extension', fee: 5000 },
    { name: 'Uhie', fee: 7000 },
    { name: 'Obagie', fee: 7000 },
    { name: 'Okha Bypass', fee: 7000 },
    { name: 'Ologbo', fee: 6000 },
    { name: 'Uholor', fee: 7000 },
    { name: 'Ekewan Barracks', fee: 6000 },
    { name: 'Presco', fee: 7000 },
    { name: 'Rubber Research', fee: 7000 },
    { name: 'Arougba', fee: 6000 }
];

async function seedStage4() {
    try {
        console.log('Applying Stage 4 migrations...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS delivery_zones (
                id SERIAL PRIMARY KEY,
                name VARCHAR(1000) NOT NULL UNIQUE,
                fee DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'active'
            );
            CREATE TABLE IF NOT EXISTS store_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL
            );
        `);
        
        await pool.query(
            `INSERT INTO store_settings (key, value) VALUES ('store_pickup_address', '16 Ihama Road Boundary') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`
        );
        
        for (const z of zones) {
            await pool.query(`INSERT INTO delivery_zones (name, fee) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET fee = EXCLUDED.fee`, [z.name, z.fee]);
        }
        
        console.log('✅ Base migrations for Delivery and Store Specs complete.');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

seedStage4();
