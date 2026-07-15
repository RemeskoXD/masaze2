import fs from 'fs';
let code = fs.readFileSync('components/ReservationCalendar.tsx', 'utf-8');
code = code.replace(/const height = \(durationMins \/ 60\) \* HOUR_HEIGHT;/g, 'let height = (durationMins / 60) * HOUR_HEIGHT;');
fs.writeFileSync('components/ReservationCalendar.tsx', code);
console.log('fixed height constant');
