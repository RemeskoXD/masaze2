import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regexUi = /<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Čas \*\w*<\/label>\n\s*<input \n\s*type="time" \n\s*required\n\s*value=\{time\}\n\s*onChange=\{e => setTime\(e\.target\.value\)\}\n\s*className="w-full bg-\[#0a2f1c\] border border-gold\/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none \[color-scheme:dark\]"\n\s*\/>\n\s*<\/div>\n\s*<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Konec \(rezerva 15m\)<\/label>\n\s*<input \n\s*type="time" \n\s*value=\{endTime\}\n\s*onChange=\{e => setEndTime\(e\.target\.value\)\}\n\s*className="w-full bg-\[#0a2f1c\] border border-gold\/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none \[color-scheme:dark\]"\n\s*\/>\n\s*<\/div>/;

const replacementUi = `<div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-sm text-gray-300">Čas od - do (rezervace)</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="time" 
                                            required
                                            value={time}
                                            onChange={e => {
                                                setTime(e.target.value);
                                                // auto-update end time will be handled by useEffect
                                            }}
                                            className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                        />
                                        <span className="text-gold">-</span>
                                        <input 
                                            type="time" 
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                            className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                    <TimelinePicker 
                                        date={date} 
                                        time={time} 
                                        endTime={endTime} 
                                        setTime={setTime} 
                                        setEndTime={setEndTime}
                                        serviceSearch={serviceSearch}
                                        reservations={reservations} 
                                        specificDatesStr={specificDatesStr} 
                                        openingHours={openingHours} 
                                    />
                                </div>`;

if (regexUi.test(code)) {
    code = code.replace(regexUi, replacementUi);
    console.log('patched manual UI with TimelinePicker');
} else {
    console.log('failed to match manual UI regex');
}

const componentDef = `function TimelinePicker({ date, time, endTime, setTime, setEndTime, serviceSearch, reservations, specificDatesStr, openingHours }: any) {
    if (!date) return <div className="text-xs text-gray-400 mt-2">Vyberte nejprve datum pro zobrazení časové osy.</div>;

    let specificDates: any = {};
    try {
        if (typeof specificDatesStr === 'string') {
            specificDates = JSON.parse(specificDatesStr);
            if (typeof specificDates === 'string') specificDates = JSON.parse(specificDates);
        } else {
            specificDates = specificDatesStr;
        }
    } catch(e) {}

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
        return <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded">Tento den je zavřeno.</div>;
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
            const srv = SERVICES_LIST.find(s => s.id === r.serviceId);
            let dur = 60;
            if (srv && srv.duration) {
                const m = srv.duration.match(/(\\d+)/);
                if (m) dur = parseInt(m[0]) + 15;
            }
            rEnd = rStart + dur;
        }
        return { start: formatTime(rStart), end: formatTime(rEnd), type: 'reservation', customer: r.customerName };
    });

    const allBlocks = [...dayBreaks, ...dayReservations];
    
    let requiredDuration = 60;
    const service = SERVICES_LIST.find(s => s.title === serviceSearch);
    if (service && service.duration) {
        const parsed = parseInt(service.duration.replace(/\\D/g, ''));
        if (!isNaN(parsed)) requiredDuration = parsed + 15;
    }

    const handleClick = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left);
        const percentage = x / rect.width;
        let clickedMins = sMins + (percentage * totalMins);
        
        // round to nearest 15 mins
        clickedMins = Math.round(clickedMins / 15) * 15;
        
        if (clickedMins < sMins) clickedMins = sMins;
        if (clickedMins + requiredDuration > eMins) clickedMins = eMins - requiredDuration;
        
        setTime(formatTime(clickedMins));
        setEndTime(formatTime(clickedMins + requiredDuration));
    };

    return (
        <div className="mt-4 border border-gold/10 rounded-lg p-3 bg-black/20">
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                <span>{dayStart}</span>
                <span>{dayEnd}</span>
            </div>
            <div 
                className="relative h-12 bg-green-900/30 rounded cursor-pointer overflow-hidden group border border-green-500/30 hover:border-gold/50 transition-colors"
                onClick={handleClick}
            >
                {/* Available background visual hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs text-green-300 pointer-events-none transition-opacity">
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
                    const bgClass = isBreak ? 'bg-gray-600/80' : 'bg-red-600/80';
                    const title = isBreak ? 'Přestávka' : \`Rezervace (\${b.customer})\`;

                    return (
                        <div 
                            key={i} 
                            className={\`absolute top-0 bottom-0 \${bgClass} border-x border-black/20\`}
                            style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                            title={title}
                        />
                    );
                })}

                {time && endTime && (
                    <div 
                        className="absolute top-0 bottom-0 bg-gold/50 border-2 border-gold rounded z-10 pointer-events-none flex items-center justify-center shadow-lg"
                        style={{ 
                            left: \`\${Math.max(0, ((parseTime(time) - sMins) / totalMins) * 100)}%\`, 
                            width: \`\${Math.min(100, ((parseTime(endTime) - parseTime(time)) / totalMins) * 100)}%\` 
                        }}
                    >
                        <span className="text-[10px] font-bold text-white bg-black/50 px-1 rounded truncate">
                            {time}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-900/50 border border-green-500/30 rounded"></div> Volno</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600/80 rounded"></div> Obsazeno</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-600/80 rounded"></div> Přestávka</div>
            </div>
        </div>
    );
}

`;

if (!code.includes('function TimelinePicker(')) {
    code = code + '\n' + componentDef;
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('added TimelinePicker component');
}
