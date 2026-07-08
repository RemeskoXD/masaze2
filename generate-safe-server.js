import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Replace the simple local database section with MySQL pool
serverCode = serverCode.replace(
`// --- Simple Local Database ---
const DB_FILE = path.join(process.cwd(), 'db.json');

async function getDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    if (!db.vouchers) {
      db.vouchers = [];
    }
    if (!db.settings) {
      db.settings = { clientSectionEnabled: false };
    }
    return db;
  } catch (error) {
    return { settings: { clientSectionEnabled: false }, reservations: [], vouchers: [] };
  }
}

async function saveDB(data: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure DB exists on startup
getDB().then(saveDB);`,
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
});`
);

// We should apply targeted replacements using Regex.

// Replace get /api/settings
serverCode = serverCode.replace(
`  app.get('/api/settings', async (req, res) => {
    const db = await getDB();
    res.json(db.settings);
  });`,
`  app.get('/api/settings', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = rows.reduce((acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }), {});
      res.json(settings);
    } catch (error) {
      res.status(500).json({ success: false, message: 'DB Error' });
    }
  });`
);

fs.writeFileSync('server.ts.safe', serverCode);
