import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /app\.get\('\/api\/settings', async \(req, res\) => \{/;
const replacement = `app.get('/api/availability', async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT date, time, endTime, serviceId FROM reservations WHERE status != 'cancelled'");
      res.json(rows);
    } catch (e) {
      console.error('/api/availability DB Error:', e);
      res.status(500).json({ success: false, message: 'DB Error' });
    }
  });

  app.get('/api/settings', async (req, res) => {`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.ts', code);
    console.log('added /api/availability successfully');
} else {
    console.log('failed to add /api/availability');
}
