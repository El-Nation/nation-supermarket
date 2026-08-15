require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({});
pool.query('SELECT payment_id, receipt_url FROM receipts ORDER BY id DESC LIMIT 5')
    .then(res => { 
        console.log("=== DB RECEIPTS ===");
        console.log(JSON.stringify(res.rows, null, 2)); 
        process.exit(0); 
    })
    .catch(e => { 
        console.error("DB ERROR TRACE:", e.message); 
        process.exit(1); 
    });
