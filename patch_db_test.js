import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  app.get('/api/db-test', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      connection.release();
      res.json({ success: true, message: 'DB connection successful!' });
    } catch (e) {
      console.error('/api/db-test Error:', e);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to connect to DB', 
        error: e.message,
        code: e.code,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        hasPassword: !!process.env.DB_PASSWORD
      });
    }
  });

  app.get('/api/reviews'`;

code = code.replace("  app.get('/api/reviews'", replacement);
fs.writeFileSync('server.ts', code);
