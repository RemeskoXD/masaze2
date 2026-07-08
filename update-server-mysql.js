const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// 1. Remove getDB and saveDB
serverCode = serverCode.replace(/\/\/ --- Simple Local Database ---[\s\S]*?async function startServer\(\) \{/, 
`import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function startServer() {`);

// 2. Replace settings endpoint
serverCode = serverCode.replace(
`  app.get('/api/settings', async (req, res) => {
    const db = await getDB();
    res.json(db.settings);
  });`,
`  app.get('/api/settings', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = (rows as any[]).reduce((acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }), {});
      res.json(settings);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });`
);

// We should replace the endpoints using edit_file instead of writing this complex JS regex script because it might break easily.
