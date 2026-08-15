import { pool } from '../config/db';

const migrateZones = async () => {
    try {
        console.log("Extracting zones natively...");
        const res = await pool.query('SELECT * FROM delivery_zones');
        const distinctZones = new Map<string, number>();

        res.rows.forEach(z => {
            const sourceString = z.areas || z.name;
            const splits = sourceString.split(/[\/,]|->/);
            const cleaned = splits.map((s: string) => s.trim().replace(/\s*axis\s*/i, ' ').replace(/\s*\(Specific\)/i, '').trim()).filter((s: string) => s.length > 0);
            
            cleaned.forEach((c: string) => {
                if (!distinctZones.has(c)) {
                    distinctZones.set(c, Number(z.fee));
                }
            });
            // Keep completely non-bundled ones too natively
            if (z.name && splits.length === 1 && !distinctZones.has(z.name)) {
                 distinctZones.set(z.name, Number(z.fee));
            }
        });

        console.log(`Found ${distinctZones.size} unique mathematically separated locations. Restructuring database...`);
        
        await pool.query('DELETE FROM delivery_zones');
        
        for (const [name, fee] of distinctZones.entries()) {
            await pool.query('INSERT INTO delivery_zones (name, fee, status) VALUES ($1, $2, $3)', [name, fee, 'active']);
        }

        console.log("Migration perfectly successfully processed natively!");
        process.exit(0);
    } catch (e) {
        console.error("Migration Error:", e);
        process.exit(1);
    }
};

migrateZones();
