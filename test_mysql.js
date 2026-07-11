import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  const val = "{}";
  try {
     await pool.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', ['test', JSON.stringify(val), JSON.stringify(val)]);
     console.log("INSERT OK");
  } catch(e) {
     console.log("INSERT FAILED", e.message);
  }
  process.exit();
}
test();
