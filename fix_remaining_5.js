import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/app\.post\('\/api\/admin\/restore', requireAdmin, async \(req, res\) => \{[\s\S]*?\}\);/,
`app.post('/api/admin/restore', requireAdmin, async (req, res) => {
    res.status(400).json({ success: false, message: 'Obnova ze zálohy je při použití MySQL databáze vypnutá. Kontaktujte správce databáze.' });
  });`);

fs.writeFileSync('server.ts', code);
