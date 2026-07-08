import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/if \(password === 'admin123'\) \{ \/\/ heslo natvrdo pro demonstraci\n      res\.json\(\{ success: true, token: 'admin123' \}\);/, 
`if (password === (process.env.ADMIN_TOKEN || 'Terezka2026.!')) {
      res.json({ success: true, token: process.env.ADMIN_TOKEN || 'Terezka2026.!' });`);

fs.writeFileSync('server.ts', code);
