import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/  app\.post\('\/api\/admin\/settings', requireAdmin, async \(req, res\) => \{\n    try \{\n      for \(const \[key, value\] of Object\.entries\(req\.body\)\) \{/,
`  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
          return res.status(400).json({ success: false, message: 'Invalid payload' });
      }
      for (const [key, value] of Object.entries(req.body)) {`
);

fs.writeFileSync('server.ts', code);
