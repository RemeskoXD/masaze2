import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/await saveDB\(backupData\);/, '');

fs.writeFileSync('server.ts', code);
