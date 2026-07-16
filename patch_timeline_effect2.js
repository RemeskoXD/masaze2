import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /React\.useEffect\(\(\) => \{[\s\S]*?\}, \[time, displayDuration, requiredDuration\]\);/;
const newEffect = `React.useEffect(() => {
        if (time) {
            const currentStartMins = parseTime(time);
            
            // Check for overlap due to addon changes
            let hasOverlap = false;
            const proposedEnd = currentStartMins + requiredDuration;
            for (const b of allBlocks) {
                const bStart = parseTime(b.start);
                const bEnd = parseTime(b.end);
                if (currentStartMins < bEnd && proposedEnd > bStart) {
                    hasOverlap = true;
                    break;
                }
            }
            
            if (hasOverlap) {
                alert('S vybranými doplňky se čas překrývá s jinou rezervací. Zvolte prosím jiný čas.');
                setTime(null);
                setEndTime(null);
                if (setDisplayEndTime) setDisplayEndTime(null);
            } else {
                setEndTime(formatTime(currentStartMins + requiredDuration));
                if (setDisplayEndTime) {
                    setDisplayEndTime(formatTime(currentStartMins + displayDuration));
                }
            }
        }
    }, [time, displayDuration, requiredDuration]);`;

code = code.replace(regex, newEffect);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched timeline effect overlap check');
