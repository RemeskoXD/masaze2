import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// 1. imports
code = code.replace("import fs from 'fs/promises';", "import fs from 'fs/promises';\nimport mysql from 'mysql2/promise';");

// 2. getDB and saveDB
const dbRegex = /\/\/ --- Simple Local Database ---[\s\S]*?\/\/ Ensure DB exists on startup\ngetDB\(\)\.then\(saveDB\);/;
const poolCode = `
// --- MySQL Database ---
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
`;
code = code.replace(dbRegex, poolCode);

// 3. /api/settings
code = code.replace(
`  app.get('/api/settings', async (req, res) => {
    const db = await getDB();
    res.json(db.settings);
  });`,
`  app.get('/api/settings', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = rows.reduce((acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }), { clientSectionEnabled: false });
      res.json(settings);
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'DB Error' });
    }
  });`
);

fs.writeFileSync('server.ts', code);
