import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /function PublicTimelinePicker\([\s\S]*?return \([\s\S]*?<\/div>\n    \);\n}/m;

const newComponent = `function PublicTimelinePicker({ date, time, endTime, setTime, setEndTime, setDisplayEndTime, serviceId, selectedAddons, reservations, specificDates, openingHours }: any) {
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
    
    let displayDuration = 60;
    const service = SERVICES_LIST.find((s: any) => s.id === serviceId);
    if (service && service.duration) {
        const parsed = parseInt(service.duration.replace(/\\D/g, ''));
        if (!isNaN(parsed)) displayDuration = parsed;
    }
    selectedAddons.forEach((addonId: number) => {
        const addon = SERVICES_LIST.find((s: any) => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\\d+)/);
            if (m) displayDuration += parseInt(m[0]);
        }
    });
    
    // Add 15 min buffer to the blocked duration
    const requiredDuration = displayDuration + 15;

    // calculate available 30-min slots
    const availableSlots: { time: string, mins: number }[] = [];
    for (let m = sMins; m <= eMins - requiredDuration; m += 30) {
        let overlap = false;
        for (const b of allBlocks) {
            const bStart = parseTime(b.start);
            const bEnd = parseTime(b.end);
            if (m < bEnd && m + requiredDuration > bStart) {
                overlap = true;
                break;
            }
        }
        if (!overlap) {
            availableSlots.push({ time: formatTime(m), mins: m });
        }
    }

    React.useEffect(() => {
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
    }, [time, displayDuration, requiredDuration]);

    return (
        <div className="mt-4 border border-gold/20 rounded-xl p-5 bg-white/50 shadow-sm flex flex-col gap-6">
            <h4 className="text-sm uppercase tracking-widest text-text-muted mb-2 font-medium">Dostupné časy</h4>
            
            {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot) => {
                        const isSelected = time === slot.time;
                        return (
                            <button
                                key={slot.time}
                                onClick={() => {
                                    setTime(slot.time);
                                    setEndTime(formatTime(slot.mins + requiredDuration));
                                    if (setDisplayEndTime) {
                                        setDisplayEndTime(formatTime(slot.mins + displayDuration));
                                    }
                                }}
                                className={\`py-3 px-2 rounded-xl text-center font-mono text-sm transition-all duration-300 border \${
                                    isSelected 
                                    ? 'bg-gold border-gold text-white shadow-md transform scale-105' 
                                    : 'bg-white border-gold/30 text-text-dark hover:border-gold hover:bg-gold/5'
                                }\`}
                            >
                                {slot.time}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="p-6 text-center text-text-muted bg-white/60 rounded-xl border border-gold/20 italic">
                    V tento den už nejsou žádné volné termíny s dostatečnou časovou rezervou pro vybranou službu.
                </div>
            )}
        </div>
    );
}`;

code = code.replace(regex, newComponent);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched to 30 min blocks');
