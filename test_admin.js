import fs from 'fs';
const admin = fs.readFileSync('components/AdminPanel.tsx', 'utf8');
const toggle = admin.match(/toggleOpen[\s\S]*?\n    };/s);
console.log(toggle[0]);
