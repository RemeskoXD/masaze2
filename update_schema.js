import mysql from 'mysql2/promise';

async function update() {
  let dbName = '';
  if (process.env.DATABASE_URL) {
      try {
          const urlObj = new URL(process.env.DATABASE_URL.replace('mysql://', 'http://'));
          const pathSegments = urlObj.pathname.split('/').filter(Boolean);
          if (pathSegments.length > 0) {
              dbName = pathSegments[pathSegments.length - 1];
          }
      } catch(e) {}
  }
  if (!dbName) {
      dbName = process.env.DB_USER; 
  }
  
  const pool = mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQL_HOST,
      port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
      user: process.env.DB_USER || process.env.MYSQL_USER,
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
      database: dbName
  });

  try {
    const conn = await pool.getConnection();
    try {
        await conn.query("ALTER TABLE vouchers ADD COLUMN validUntil VARCHAR(50)");
        console.log("Added validUntil column");
    } catch(e) {
        if (e.code !== 'ER_DUP_FIELDNAME') {
            throw e;
        }
        console.log("Column already exists");
    }
    conn.release();
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
update();
