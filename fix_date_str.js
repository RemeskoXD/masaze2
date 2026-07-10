import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
/const dateStr = date\.toISOString\(\)\.split\('T'\)\[0\];/g,
"const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];"
);
code = code.replace(
/const todayStr = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g,
"const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];"
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
