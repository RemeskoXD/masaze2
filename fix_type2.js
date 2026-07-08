import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/const \[rows\] = await pool\.query\('SELECT \* FROM reviews ORDER BY id DESC'\);/,
`const [rows]: any = await pool.query('SELECT * FROM reviews ORDER BY id DESC');`
);

fs.writeFileSync('server.ts', code);
