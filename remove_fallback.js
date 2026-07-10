import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/token === \(process\.env\.ADMIN_TOKEN \|\| 'Terezka2026\.!'\)/g,
"token === process.env.ADMIN_TOKEN"
);
code = code.replace(
/password === \(process\.env\.ADMIN_TOKEN \|\| 'Terezka2026\.!'\)/g,
"password === process.env.ADMIN_TOKEN"
);
code = code.replace(
/token: process\.env\.ADMIN_TOKEN \|\| 'Terezka2026\.!'/g,
"token: process.env.ADMIN_TOKEN"
);

fs.writeFileSync('server.ts', code);
