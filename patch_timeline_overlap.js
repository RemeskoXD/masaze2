import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex = /const handleClick = \(e: any\) => \{[\s\S]*?setEndTime\(formatTime\(clickedMins \+ requiredDuration\)\);\n    \};/;

const replacement = `const handleClick = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left);
        const percentage = x / rect.width;
        let clickedMins = sMins + (percentage * totalMins);
        
        // round to nearest 15 mins
        clickedMins = Math.round(clickedMins / 15) * 15;
        
        if (clickedMins < sMins) clickedMins = sMins;
        if (clickedMins + requiredDuration > eMins) clickedMins = eMins - requiredDuration;
        
        // Check for overlaps with blocks
        let hasOverlap = false;
        const proposedStart = clickedMins;
        const proposedEnd = clickedMins + requiredDuration;

        for (const b of allBlocks) {
            const bStart = parseTime(b.start);
            const bEnd = parseTime(b.end);
            // Overlap condition: start is before end of block, and end is after start of block
            if (proposedStart < bEnd && proposedEnd > bStart) {
                hasOverlap = true;
                break;
            }
        }

        if (hasOverlap) {
            alert('Tento čas se překrývá s jinou rezervací nebo přestávkou. Vyberte prosím volný čas.');
            return;
        }

        setTime(formatTime(clickedMins));
        setEndTime(formatTime(clickedMins + requiredDuration));
    };`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched timeline overlap successfully');
} else {
    console.log('failed to patch timeline overlap');
}
