import fs from 'fs';
let code = fs.readFileSync('components/ReservationCalendar.tsx', 'utf-8');

const regex = /const endTimeStr = \`\$\{endHours\.toString\(\)\.padStart\(2, '0'\)\}:\$\{remainingEndMinutes\.toString\(\)\.padStart\(2, '0'\)\}\`;/;

const replacement = `let endTimeStr = \`\${endHours.toString().padStart(2, '0')}:\${remainingEndMinutes.toString().padStart(2, '0')}\`;
        
        if (res.endTime) {
            endTimeStr = res.endTime;
            const [endH, endM] = res.endTime.split(':').map(Number);
            const durationCustom = ((endH - hours) * 60) + (endM - minutes);
            if (durationCustom > 0) {
                height = (durationCustom / 60) * HOUR_HEIGHT;
            }
        }`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationCalendar.tsx', code);
    console.log('patched getReservationStyle2 successfully');
} else {
    console.log('failed to match regex getReservationStyle2');
}
