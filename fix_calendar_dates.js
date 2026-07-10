import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
/const isWeekend = date\.getDay\(\) === 0 \|\| date\.getDay\(\) === 6;\s*\/\/\s*Simple past check \(allowing today\)\s*const todayStr = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\s*const isPast = dateStr < todayStr;\s*const disabled = isWeekend \|\| isPast;/g,
`const todayStr = new Date().toISOString().split('T')[0];
const isPast = dateStr < todayStr;
const hasSlots = generateTimeSlots(selectedService, selectedAddons, dateStr).length > 0;
const disabled = isPast || !hasSlots;`
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
