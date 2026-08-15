const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.query("UPDATE users SET role = 'admin'")
  .then(() => console.log('Successfully promoted local accounts to Admin for Stage 4 Testing.'))
  .catch(console.error)
  .finally(() => pool.end());
