import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

// 1. Add selectedEndTime state
code = code.replace(
  'const [selectedTime, setSelectedTime] = useState<string | null>(null);',
  'const [selectedTime, setSelectedTime] = useState<string | null>(null);\n  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);'
);

// 2. Add endTime to fetch
code = code.replace(
  'time: selectedTime,\n                customerName',
  'time: selectedTime,\n                endTime: selectedEndTime,\n                customerName'
);

// 3. Add PublicTimelinePicker definition
const timelineComponent = `function PublicTimelinePicker({ date, time, endTime, setTime, setEndTime, serviceId, selectedAddons, reservations, specificDates, openingHours }: any) {
    if (!date) return null;

    let dayStart = '09:00';
    let dayEnd = '18:00';
    let isClosed = false;
    let dayBreaks: any[] = [];
    
    const dObj = new Date(date);
    const daysOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const dayName = daysOfWeek[dObj.getDay()];
    
    if (openingHours && openingHours[dayName]) {
        dayStart = openingHours[dayName].start || dayStart;
        dayEnd = openingHours[dayName].end || dayEnd;
        if (openingHours[dayName].breakStart && openingHours[dayName].breakEnd) {
             dayBreaks.push({ start: openingHours[dayName].breakStart, end: openingHours[dayName].breakEnd, type: 'break' });
        }
        if (openingHours[dayName].isOpen === false) isClosed = true;
    }

    if (specificDates && specificDates[date]) {
         if (specificDates[date].isOpen === false) {
             isClosed = true;
         } else {
             isClosed = false;
             if (specificDates[date].start) dayStart = specificDates[date].start;
             if (specificDates[date].end) dayEnd = specificDates[date].end;
             if (specificDates[date].breaks) dayBreaks = specificDates[date].breaks.map((b: any) => ({ ...b, type: 'break' }));
         }
    }

    if (isClosed) {
        return <div className="text-sm text-red-500 mt-2 p-3 bg-red-50 rounded-xl text-center">Tento den je zavřeno.</div>;
    }

    const parseTime = (t: string) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    
    const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60) % 24;
        const m = Math.floor(mins % 60);
        return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`;
    };

    const sMins = parseTime(dayStart);
    const eMins = parseTime(dayEnd);
    const totalMins = eMins - sMins;
    
    if (totalMins <= 0) return null;

    // existing reservations
    const dayReservations = (reservations || []).filter((r: any) => r.date === date && r.status !== 'cancelled').map((r: any) => {
        let rStart = parseTime(r.time);
        let rEnd = rStart;
        if (r.endTime) {
            rEnd = parseTime(r.endTime);
        } else {
            const srv = SERVICES_LIST.find((s: any) => s.id === r.serviceId);
            let dur = 60;
            if (srv && srv.duration) {
                const m = srv.duration.match(/(\\d+)/);
                if (m) dur = parseInt(m[0]) + 15;
            }
            rEnd = rStart + dur;
        }
        return { start: formatTime(rStart), end: formatTime(rEnd), type: 'reservation' };
    });

    const allBlocks = [...dayBreaks, ...dayReservations];
    
    let requiredDuration = 60;
    const service = SERVICES_LIST.find((s: any) => s.id === serviceId);
    if (service && service.duration) {
        const parsed = parseInt(service.duration.replace(/\\D/g, ''));
        if (!isNaN(parsed)) requiredDuration = parsed;
    }
    selectedAddons.forEach((addonId: number) => {
        const addon = SERVICES_LIST.find((s: any) => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\\d+)/);
            if (m) requiredDuration += parseInt(m[0]);
        }
    });
    // Add 15 min buffer to the final duration
    requiredDuration += 15;

    const handleClick = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left);
        const percentage = x / rect.width;
        let clickedMins = sMins + (percentage * totalMins);
        
        // round to nearest 15 mins
        clickedMins = Math.round(clickedMins / 15) * 15;
        
        if (clickedMins < sMins) clickedMins = sMins;
        if (clickedMins + requiredDuration > eMins) clickedMins = eMins - requiredDuration;
        
        let hasOverlap = false;
        const proposedStart = clickedMins;
        const proposedEnd = clickedMins + requiredDuration;

        for (const b of allBlocks) {
            const bStart = parseTime(b.start);
            const bEnd = parseTime(b.end);
            if (proposedStart < bEnd && proposedEnd > bStart) {
                hasOverlap = true;
                break;
            }
        }

        if (hasOverlap) {
            alert('Tento čas se překrývá s jinou rezervací nebo přestávkou. Vyberte prosím volný čas na zelené ose.');
            return;
        }

        setTime(formatTime(clickedMins));
        setEndTime(formatTime(clickedMins + requiredDuration));
    };

    return (
        <div className="mt-2 border border-gold/20 rounded-xl p-4 bg-white/50 shadow-sm">
            <div className="flex justify-between text-sm text-text-muted mb-3 font-medium">
                <span>{dayStart}</span>
                <span>{dayEnd}</span>
            </div>
            <div 
                className="relative h-16 bg-green-100 rounded-lg cursor-pointer overflow-hidden group border border-green-200 hover:border-gold/50 transition-colors"
                onClick={handleClick}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm text-green-700 pointer-events-none transition-opacity bg-green-50/50">
                    Klikněte pro výběr času
                </div>

                {allBlocks.map((b, i) => {
                    const bStart = parseTime(b.start);
                    const bEnd = parseTime(b.end);
                    if (bEnd <= sMins || bStart >= eMins) return null;
                    
                    const drawStart = Math.max(bStart, sMins);
                    const drawEnd = Math.min(bEnd, eMins);
                    
                    const left = ((drawStart - sMins) / totalMins) * 100;
                    const width = ((drawEnd - drawStart) / totalMins) * 100;
                    
                    const isBreak = b.type === 'break';
                    const bgClass = isBreak ? 'bg-gray-300' : 'bg-red-200';
                    const title = isBreak ? 'Přestávka' : 'Obsazeno';

                    return (
                        <div 
                            key={i} 
                            className={\`absolute top-0 bottom-0 \${bgClass} border-x border-white/50\`}
                            style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                            title={title}
                        />
                    );
                })}

                {time && endTime && (
                    <div 
                        className="absolute top-0 bottom-0 bg-gold border-2 border-gold-dark rounded z-10 pointer-events-none flex items-center justify-center shadow-md"
                        style={{ 
                            left: \`\${Math.max(0, ((parseTime(time) - sMins) / totalMins) * 100)}%\`, 
                            width: \`\${Math.min(100, ((parseTime(endTime) - parseTime(time)) / totalMins) * 100)}%\` 
                        }}
                    >
                        <span className="text-xs font-bold text-white bg-black/30 px-2 py-1 rounded truncate">
                            {time} - {endTime}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center gap-6 mt-4 text-sm text-text-muted">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div> Volno</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-200 rounded"></div> Obsazeno</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Přestávka</div>
            </div>
        </div>
    );
}

`;

if (!code.includes('function PublicTimelinePicker')) {
    code = code.replace('export default function ReservationSystem() {', timelineComponent + 'export default function ReservationSystem() {');
}

// 4. Replace the old button grid with the PublicTimelinePicker
const regexGrid = /<motion\.div \n\s*className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"[\s\S]*?<\/motion\.div>/;
const replacementGrid = `<div className="mt-2">
                                        <PublicTimelinePicker
                                            date={selectedDate}
                                            time={selectedTime}
                                            endTime={selectedEndTime}
                                            setTime={setSelectedTime}
                                            setEndTime={setSelectedEndTime}
                                            serviceId={selectedService}
                                            selectedAddons={selectedAddons}
                                            reservations={bookedSlots}
                                            specificDates={specificDates}
                                            openingHours={openingHours}
                                        />
                                    </div>`;

code = code.replace(regexGrid, replacementGrid);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched public timeline successfully');
