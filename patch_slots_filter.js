import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /const slots = \[\];/;
const replacement = `// Combine settings breaks with existing reservations for this date
    bookedSlots.filter((b: any) => b.date === dateStr).forEach((b: any) => {
        let rsMins = 0;
        let reMins = 0;
        if (b.time) {
            const ts = b.time.split(':');
            rsMins = parseInt(ts[0]) * 60 + parseInt(ts[1]);
        }
        if (b.endTime) {
            const te = b.endTime.split(':');
            reMins = parseInt(te[0]) * 60 + parseInt(te[1]);
        } else if (b.serviceId && b.time) {
            // Fallback if no endTime is saved (old reservations)
            let bDuration = 60;
            const bService = SERVICES_LIST.find(s => s.id === b.serviceId);
            if (bService) {
                const bm = bService.duration.match(/(\\d+)/);
                if (bm) bDuration = parseInt(bm[0]) + 15;
            }
            reMins = rsMins + bDuration;
        }
        
        if (rsMins > 0 && reMins > rsMins) {
            // Buffer time before and after reservation (let's say 0 mins buffer since the reservation already includes a 15 min buffer in endTime, or we can just use the exact start/end)
            breaks.push({
                start: rsMins,
                end: reMins
            });
        }
    });

    const slots = [];`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationSystem.tsx', code);
    console.log('patched generateTimeSlots with reservations successfully');
} else {
    console.log('failed to patch generateTimeSlots with reservations');
}
