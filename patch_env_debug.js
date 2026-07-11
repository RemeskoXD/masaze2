import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  app.get('/api/env-debug', async (req, res) => {
    res.json({
      has_DB_HOST: !!process.env.DB_HOST,
      has_MYSQL_HOST: !!process.env.MYSQL_HOST,
      has_DB_USER: !!process.env.DB_USER,
      has_MYSQL_USER: !!process.env.MYSQL_USER,
      has_DB_NAME: !!process.env.DB_NAME,
      has_DB_DATABASE: !!process.env.DB_DATABASE,
      has_MYSQL_DATABASE: !!process.env.MYSQL_DATABASE,
      has_DATABASE_URL: !!process.env.DATABASE_URL,
      DB_NAME_VALUE: process.env.DB_NAME || null,
      DB_DATABASE_VALUE: process.env.DB_DATABASE || null,
      MYSQL_DATABASE_VALUE: process.env.MYSQL_DATABASE || null
    });
  });

  app.get('/api/db-test'`;

code = code.replace("  app.get('/api/db-test'", replacement);
fs.writeFileSync('server.ts', code);
