import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
  // --- REVIEWS API ---
  app.get('/api/reviews', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const { author, rating, text, date } = req.body;
      if (!author || !rating || !text) {
        return res.status(400).json({ success: false, message: 'Chybí povinné údaje' });
      }
      
      const id = Date.now();
      await pool.query(
        'INSERT INTO reviews (id, author, rating, text, date) VALUES (?, ?, ?, ?, ?)',
        [id, author, rating, text, date || new Date().toLocaleDateString('cs-CZ')]
      );
      
      res.json({ success: true, id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });

  // --- END REVIEWS API ---
  
  // --- PUBLIC API Routes ---
`;

code = code.replace('// --- PUBLIC API Routes ---', endpoints);
fs.writeFileSync('server.ts', code);
