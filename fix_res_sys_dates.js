import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
  /const \[openingHours, setOpeningHours\].*?\}\);/s,
  "const [specificDates, setSpecificDates] = useState<any>({});"
);
code = code.replace(/const \[closedDates, setClosedDates\] = useState<string>\(''\);\n/, "");

code = code.replace(
  /if \(data\.openingHours\) setOpeningHours\(data\.openingHours\);\s*if \(data\.closedDates\) setClosedDates\(data\.closedDates\);/,
  "if (data.specificDates) { try { setSpecificDates(JSON.parse(data.specificDates)); } catch(e){} }"
);

const newGenerate = `  const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = selectedDate) => {
    if (!serviceId || !dateStr) return [];
    
    const settings = specificDates[dateStr];
    if (!settings || !settings.isOpen || !settings.start || !settings.end) return [];

    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
    
    const durationMatch = service.duration.match(/(\\d+)/);
    let duration = durationMatch ? parseInt(durationMatch[0]) : 60;
    selectedAddons.forEach(addonId => {
        const addon = SERVICES_LIST.find(s => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\\d+)/);
            if (m) duration += parseInt(m[0]);
        }
    });

    const startParts = settings.start.split(':');
    const endParts = settings.end.split(':');
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    let gap = 0;
    if (duration <= 30) gap = 15;
    else if (duration === 60) gap = 30;
    else gap = 30;
    const totalBlockMinutes = duration + gap;

    const breaks = (settings.breaks || []).map((br: any) => {
        const bs = br.start.split(':');
        const be = br.end.split(':');
        return {
            start: parseInt(bs[0]) * 60 + parseInt(bs[1]),
            end: parseInt(be[0]) * 60 + parseInt(be[1])
        };
    });

    const slots = [];
    let currentMinutes = startMinutes;
    
    while (currentMinutes + duration <= endMinutes) {
        let isValid = true;
        let blockEnd = currentMinutes + duration;
        
        for (const br of breaks) {
            if (currentMinutes < br.end && blockEnd > br.start) {
                isValid = false;
                currentMinutes = br.end; // Jump to the end of the break
                break;
            }
        }
        
        if (isValid) {
            const h = Math.floor(currentMinutes / 60);
            const m = currentMinutes % 60;
            slots.push(\`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`);
            currentMinutes += totalBlockMinutes;
        }
    }
    return slots;
  };`;

const oldGenerateRegex = /const generateTimeSlots = \(serviceId:.*?return slots;\n  \};/s;
code = code.replace(oldGenerateRegex, newGenerate);

fs.writeFileSync('components/ReservationSystem.tsx', code);
