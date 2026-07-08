import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// Replace /api/admin/reservations
code = code.replace(
`  app.get('/api/admin/reservations', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      const sorted = [...(db.reservations || [])].sort((a: any, b: any) => b.id - a.id);
      res.json({ success: true, reservations: sorted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání' });
    }
  });`,
`  app.get('/api/admin/reservations', requireAdmin, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM reservations ORDER BY id DESC');
      res.json({ success: true, reservations: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání' });
    }
  });`
);

// Replace /api/admin/vouchers
code = code.replace(
`  app.get('/api/admin/vouchers', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      const sorted = [...(db.vouchers || [])].sort((a: any, b: any) => b.id - a.id);
      res.json({ success: true, vouchers: sorted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání poukazů' });
    }
  });`,
`  app.get('/api/admin/vouchers', requireAdmin, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vouchers ORDER BY id DESC');
      res.json({ success: true, vouchers: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání poukazů' });
    }
  });`
);

fs.writeFileSync('server.ts', code);
