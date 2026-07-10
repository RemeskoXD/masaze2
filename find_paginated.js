import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');
const match = code.match(/.*paginatedReservations.*/g);
console.log(match);
