import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const oldCode = `    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }`;

const newCode = `    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(d.getFullYear(), d.getMonth(), i));
    }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('components/ReservationSystem.tsx', code);
