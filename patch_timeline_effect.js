import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /const handleManualTimeChange = \(e: any\) => \{/;
const newEffect = `
    React.useEffect(() => {
        if (time) {
            const currentStartMins = parseTime(time);
            setEndTime(formatTime(currentStartMins + requiredDuration));
            if (setDisplayEndTime) {
                setDisplayEndTime(formatTime(currentStartMins + displayDuration));
            }
        }
    }, [time, displayDuration, requiredDuration]);

    const handleManualTimeChange = (e: any) => {`;

code = code.replace(regex, newEffect);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched timeline effect');
