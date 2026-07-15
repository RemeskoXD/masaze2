import fs from 'fs';
let code = fs.readFileSync('components/ReservationCalendar.tsx', 'utf-8');

const regex = /const getReservationStyle = \(res: any\) => \{[\s\S]*?return \{ top: `\$\{top\}px`, height: `\$\{Math\.max\(height, 30\)\}px`, isPast \};\n    \};/;

const replacement = `const getReservationStyle = (res: any) => {
        const [hours, minutes] = res.time.split(':').map(Number);
        let durationMins = 60;
        const service = SERVICES_LIST.find(s => s.id === res.serviceId);
        if (service && service.duration) {
            const parsed = parseInt(service.duration.replace(/\\D/g, ''));
            if (!isNaN(parsed)) durationMins = parsed + 15; // + 15 min reserve
        }
        const startMinutesFromTop = ((hours - START_HOUR) * 60) + minutes;
        const top = (startMinutesFromTop / 60) * HOUR_HEIGHT;
        const height = (durationMins / 60) * HOUR_HEIGHT;
        const resDateTime = new Date(\`\${res.date}T\${res.time}\`);
        const isPast = resDateTime < new Date();
        
        // Calculate end time
        const endMinutes = minutes + durationMins;
        const endHours = hours + Math.floor(endMinutes / 60);
        const remainingEndMinutes = endMinutes % 60;
        const endTimeStr = \`\${endHours.toString().padStart(2, '0')}:\${remainingEndMinutes.toString().padStart(2, '0')}\`;

        return { top: \`\${top}px\`, height: \`\${Math.max(height, 30)}px\`, isPast, endTimeStr };
    };`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationCalendar.tsx', code);
    console.log('patched getReservationStyle successfully');
} else {
    console.log('failed to match regex getReservationStyle');
}
