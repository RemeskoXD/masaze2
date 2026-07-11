import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(`  app.get('/api/reviews', async (req, res) => {
    try {
      const [rows]: any = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });`, `  app.get('/api/reviews', async (req, res) => {
    try {
      const [rows]: any = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
      res.json(rows);
    } catch (e) {
      console.error('/api/reviews DB Error:', e);
      res.status(500).json({ error: 'DB error', details: e.message || String(e) });
    }
  });`);

fs.writeFileSync('server.ts', code);
