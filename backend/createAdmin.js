const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

const createAdmin = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  try {
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ('Nation Admin', 'admin@nation.com', $1, 'admin')",
      [hash]
    );
    console.log('Admin account successfully provisioned!');
  } catch (e) {
    if (e.code === '23505') {
       console.log('Account exists, updating its hash to admin123...');
       await pool.query("UPDATE users SET role = 'admin', password = $1 WHERE email = 'admin@nation.com'", [hash]);
    } else {
       console.error(e);
    }
  } finally {
    pool.end();
  }
}

createAdmin();
