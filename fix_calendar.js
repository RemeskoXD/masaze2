import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const oldState = `  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [specificDates, setSpecificDates] = useState<any>({});`;

const newState = `  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [specificDates, setSpecificDates] = useState<any>({});
  const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Úterý': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Středa': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Čtvrtek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Pátek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Sobota': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });`;
code = code.replace(oldState, newState);

const oldFetch = `          if (data.specificDates) {
            try {
              let parsed = data.specificDates;
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              setSpecificDates(parsed || {});
            } catch(e){}
          }`;
const newFetch = `          if (data.specificDates) {
            try {
              let parsed = data.specificDates;
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              setSpecificDates(parsed || {});
            } catch(e){}
          }
          if (data.openingHours) {
            try {
              let parsedOh = data.openingHours;
              if (typeof parsedOh === 'string') parsedOh = JSON.parse(parsedOh);
              if (typeof parsedOh === 'string') parsedOh = JSON.parse(parsedOh);
              if (parsedOh && typeof parsedOh === 'object') {
                 setOpeningHours(parsedOh);
              }
            } catch(e){}
          }`;
code = code.replace(oldFetch, newFetch);

const oldSlots = `    const settings = specificDates[dateStr];
    if (!settings || !settings.isOpen || !settings.start || !settings.end) return [];`;

const newSlots = `    const d = new Date(dateStr);
    const daysOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const dayName = daysOfWeek[d.getDay()];
    
    let settings = specificDates[dateStr];
    
    if (!settings) {
        const oh = openingHours[dayName];
        if (oh) {
            // Check if it's explicitly closed. If it has start and end but we don't have "isOpen" property, we consider it open unless it's missing
            if (oh.start && oh.end) {
                settings = {
                    isOpen: true,
                    start: oh.start,
                    end: oh.end,
                    breaks: (oh.breakStart && oh.breakEnd) ? [{start: oh.breakStart, end: oh.breakEnd}] : []
                };
            }
        }
    }
    
    if (!settings || !settings.isOpen || !settings.start || !settings.end) return [];`;
code = code.replace(oldSlots, newSlots);

fs.writeFileSync('components/ReservationSystem.tsx', code);
