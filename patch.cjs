const fs = require('fs');

const content = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const anchor = "import { QRCodeSVG } from 'qrcode.react';";
const importsEnd = content.lastIndexOf(anchor) + anchor.length + 1;

const resSystemIndex = content.indexOf('const ReservationSystem: React.FC = () => {');

const before = content.substring(0, resSystemIndex);
const generateStr = before.substring(importsEnd); // The old generateTimeSlots

let newContent = content.replace(generateStr, '\n\n'); // replace old generate with empty

const hookStr = `
  const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00' },
    'Úterý': { start: '09:00', end: '18:00' },
    'Středa': { start: '09:00', end: '18:00' },
    'Čtvrtek': { start: '09:00', end: '18:00' },
    'Pátek': { start: '09:00', end: '18:00' },
    'Sobota': { start: '09:00', end: '18:00' },
    'Neděle': { start: '09:00', end: '18:00' }
  });

  useEffect(() => {
     const fetchSettings = async () => {
         try {
             const res = await fetch('/api/settings');
             if (res.ok) {
                 const data = await res.json();
                 if (data.openingHours) setOpeningHours(data.openingHours);
             }
         } catch (e) {
             console.log(e);
         }
     };
     fetchSettings();
  }, []);

  const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = selectedDate) => {
    if (!serviceId) return [];
    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
  
    // Parse duration number (e.g. "60 min" -> 60)
    const durationMatch = service.duration.match(/(\\d+)/);
    let duration = durationMatch ? parseInt(durationMatch[0]) : 60;
  
    // Add addon durations
    selectedAddons.forEach(addonId => {
        const addon = SERVICES_LIST.find(s => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\\d+)/);
            if (m) duration += parseInt(m[0]);
        }
    });

    let dayOfWeek = 'Pondělí';
    if (dateStr) {
      const d = new Date(dateStr);
      dayOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][d.getDay()];
    }

    const daySettings = openingHours[dayOfWeek];
    if (!daySettings || !daySettings.start || !daySettings.end) return [];

    const startParts = daySettings.start.split(':');
    const endParts = daySettings.end.split(':');
    
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  
    // Gap between massages based on duration
    let gap = 0;
    if (duration <= 30) gap = 15;
    else if (duration === 60) gap = 30;
    else gap = 30; // 90 min and more
  
    const totalBlockMinutes = duration + gap;
    const slots = [];
    
    let currentMinutes = startMinutes;
    
    // Create blocks that fit in the window
    while (currentMinutes + duration <= endMinutes) {
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        slots.push(\`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`);
        currentMinutes += totalBlockMinutes;
    }
  
    return slots;
  };
`;

newContent = newContent.replace('const [currentMonth, setCurrentMonth] = useState(new Date());', 'const [currentMonth, setCurrentMonth] = useState(new Date());\n' + hookStr);
fs.writeFileSync('components/ReservationSystem.tsx', newContent);
console.log('patched');
