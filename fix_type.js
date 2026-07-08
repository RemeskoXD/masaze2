import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/const \[rows\] = await pool\.query\('SELECT setting_key, setting_value FROM settings'\);/,
`const [rows]: any = await pool.query('SELECT setting_key, setting_value FROM settings');`
);

code = code.replace(
/const settings = rows\.reduce\(\(acc, row\) => \(\{ \.\.\.acc, \[row\.setting_key\]: row\.setting_value \}\), \{ clientSectionEnabled: false \}\);/,
`const settings = Array.isArray(rows) ? rows.reduce((acc: any, row: any) => ({ ...acc, [row.setting_key]: row.setting_value }), { clientSectionEnabled: false }) : { clientSectionEnabled: false };`
);

fs.writeFileSync('server.ts', code);
