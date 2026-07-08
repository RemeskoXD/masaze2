import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testuji připojení k databázi...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT 1 as result');
    console.log('✅ Připojení bylo úspěšné! Výsledek testovacího dotazu:', rows);
    await connection.end();
  } catch (error) {
    console.error('❌ Připojení selhalo:', error);
  }
}

testConnection();
