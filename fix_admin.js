import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/if \(token === \(process\.env\.ADMIN_TOKEN \|\| 'Terezka2026\.!'\)\)/g,
"if (token === (process.env.ADMIN_TOKEN || 'Terezka2026.!'))"
);

fs.writeFileSync('server.ts', code);
