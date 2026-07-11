import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(`  app.get('/api/settings', async (req, res) => {
    try {
      const [rows]: any = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = Array.isArray(rows) ? rows.reduce((acc: any, row: any) => ({ ...acc, [row.setting_key]: row.setting_value }), { clientSectionEnabled: false }) : { clientSectionEnabled: false };
      res.json(settings);
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'DB Error' });
    }
  });`, `  app.get('/api/settings', async (req, res) => {
    try {
      const [rows]: any = await pool.query('SELECT setting_key, setting_value FROM settings');
      const settings = Array.isArray(rows) ? rows.reduce((acc: any, row: any) => ({ ...acc, [row.setting_key]: row.setting_value }), { clientSectionEnabled: false }) : { clientSectionEnabled: false };
      res.json(settings);
    } catch (e) {
      console.error('/api/settings DB Error:', e);
      res.status(500).json({ success: false, message: 'DB Error', details: e.message || String(e) });
    }
  });`);

fs.writeFileSync('server.ts', code);
