import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
/const \[openingHours, setOpeningHours\] = useState<any>\(\{.+\}\);/s,
`const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Úterý': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Středa': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Čtvrtek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Pátek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Sobota': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });
  const [closedDates, setClosedDates] = useState<string>('');`
);

code = code.replace(
/if \(data\.openingHours\) setOpeningHours\(data\.openingHours\);/,
`if (data.openingHours) setOpeningHours(data.openingHours);
                 if (data.closedDates) setClosedDates(data.closedDates);`
);

code = code.replace(
/let dayOfWeek = 'Pondělí';\n    if \(dateStr\) \{\n      const d = new Date\(dateStr\);\n      dayOfWeek = \['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'\]\[d\.getDay\(\)\];\n    \}/,
`let dayOfWeek = 'Pondělí';
    if (dateStr) {
      if (closedDates.includes(dateStr)) return []; // Den je uzavřen
      const d = new Date(dateStr);
      dayOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][d.getDay()];
    }`
);

const timeSlotGenLogic = `const totalBlockMinutes = duration + gap;
    const slots = [];
    
    let breakStartMinutes = -1;
    let breakEndMinutes = -1;
    if (daySettings.breakStart && daySettings.breakEnd) {
        const bs = daySettings.breakStart.split(':');
        const be = daySettings.breakEnd.split(':');
        breakStartMinutes = parseInt(bs[0]) * 60 + parseInt(bs[1]);
        breakEndMinutes = parseInt(be[0]) * 60 + parseInt(be[1]);
    }
    
    let currentMinutes = startMinutes;
    
    // Create blocks that fit in the window
    while (currentMinutes + duration <= endMinutes) {
        // Zkontrolujeme jestli blok nekoliduje s pauzou
        let isValid = true;
        
        if (breakStartMinutes !== -1 && breakEndMinutes !== -1) {
            const blockEnd = currentMinutes + duration;
            // Kolize: začátek bloku je před koncem pauzy a konec bloku je za začátkem pauzy
            if (currentMinutes < breakEndMinutes && blockEnd > breakStartMinutes) {
                isValid = false;
                // Přeskočíme za konec pauzy
                currentMinutes = breakEndMinutes;
                continue;
            }
        }
        
        if (isValid) {
            const h = Math.floor(currentMinutes / 60);
            const m = currentMinutes % 60;
            slots.push(\`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`);
            currentMinutes += totalBlockMinutes;
        }
    }`;

code = code.replace(
/const totalBlockMinutes = duration \+ gap;\n    const slots = \[\];\n    \n    let currentMinutes = startMinutes;\n    \n    \/\/ Create blocks that fit in the window\n    while \(currentMinutes \+ duration <= endMinutes\) \{\n        const h = Math\.floor\(currentMinutes \/ 60\);\n        const m = currentMinutes % 60;\n        slots\.push\(\`\$\{h\.toString\(\)\.padStart\(2, '0'\)\}:\$\{m\.toString\(\)\.padStart\(2, '0'\)\}\`\);\n        currentMinutes \+= totalBlockMinutes;\n    \}/,
timeSlotGenLogic
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
