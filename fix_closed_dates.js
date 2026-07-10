import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
/if \(closedDates\.includes\(dateStr\)\) return \[\];/,
`if (closedDates.split(',').includes(dateStr)) return [];`
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
