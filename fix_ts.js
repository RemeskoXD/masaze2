import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(/const \{ id \} = req\.params;/g, 'const id = req.params.id as string;');
fs.writeFileSync('server.ts', code);
console.log('fixed TS');
