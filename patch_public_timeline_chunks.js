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

    const checkAndSetTime = (clickedMins: number) => {
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
            alert('Vybraný čas se překrývá s jinou rezervací nebo přestávkou.');
            return false;
        }

        setTime(formatTime(clickedMins));
        setEndTime(formatTime(clickedMins + requiredDuration));
        if (setDisplayEndTime) {
            setDisplayEndTime(formatTime(clickedMins + displayDuration));
        }
        return true;
    };

    const handleManualTimeChange = (e: any) => {
        const val = e.target.value;
        if (!val) return;
        const mins = parseTime(val);
        checkAndSetTime(mins);
    };

    // Split timeline into 3 or 4 hour chunks
    const chunks: { start: number; end: number }[] = [];
    const step = 4 * 60; // 4 hours
    for (let current = sMins; current < eMins; current += step) {
        chunks.push({ start: current, end: Math.min(current + step, eMins) });
    }

    const selStart = time ? parseTime(time) : null;
    const selEnd = selStart !== null ? selStart + requiredDuration : null;
    const displayEnd = selStart !== null ? selStart + displayDuration : null;

    return (
        <div className="mt-4 border border-gold/20 rounded-xl p-5 bg-white/50 shadow-sm flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Přesný čas začátku</label>
                    <input 
                        type="time" 
                        value={time || ''} 
                        onChange={handleManualTimeChange}
                        className="bg-white border border-gold/30 rounded-lg px-4 py-2 text-text-dark focus:border-gold outline-none w-full sm:w-40 font-mono"
                    />
                </div>
                
                {time && (
                    <div className="text-sm font-medium text-text-dark bg-gold/10 px-4 py-2 rounded-lg border border-gold/20 flex flex-col items-end gap-1">
                        <div>
                            <span>Vybráno: </span>
                            <span className="font-bold text-gold-dark">{time} - {formatTime(displayEnd!)}</span>
                        </div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider">
                            Blokováno včetně přípravy do {formatTime(selEnd!)}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {chunks.map((chunk, idx) => {
                    const chunkMins = chunk.end - chunk.start;
                    
                    // Generate hour ticks
                    const ticks = [];
                    for (let t = chunk.start; t <= chunk.end; t += 60) {
                        ticks.push(t);
                    }

                    return (
                        <div key={idx} className="relative">
                            <div className="flex justify-between text-xs text-text-muted mb-1 font-medium px-1">
                                <span>{formatTime(chunk.start)}</span>
                                <span>{formatTime(chunk.end)}</span>
                            </div>
                            
                            <div 
                                className="relative h-14 bg-green-50 rounded-lg cursor-pointer overflow-hidden group border border-green-200 hover:border-gold/50 transition-colors shadow-inner"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = Math.max(0, e.clientX - rect.left);
                                    const percentage = x / rect.width;
                                    let clickedMins = chunk.start + (percentage * chunkMins);
                                    clickedMins = Math.round(clickedMins / 15) * 15;
                                    checkAndSetTime(clickedMins);
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm text-green-700 pointer-events-none transition-opacity bg-green-50/50 z-20 font-medium">
                                    Klikněte pro výběr
                                </div>

                                {/* Grid lines (Ticks) */}
                                {ticks.map(tick => {
                                    if (tick === chunk.start || tick === chunk.end) return null;
                                    const left = ((tick - chunk.start) / chunkMins) * 100;
                                    return (
                                        <div 
                                            key={tick}
                                            className="absolute top-0 bottom-0 border-l border-green-200/50 z-0"
                                            style={{ left: \`\${left}%\` }}
                                        />
                                    );
                                })}

                                {/* Blocked areas */}
                                {allBlocks.map((b, i) => {
                                    const bStart = parseTime(b.start);
                                    const bEnd = parseTime(b.end);
                                    if (bEnd <= chunk.start || bStart >= chunk.end) return null;
                                    
                                    const drawStart = Math.max(bStart, chunk.start);
                                    const drawEnd = Math.min(bEnd, chunk.end);
                                    
                                    const left = ((drawStart - chunk.start) / chunkMins) * 100;
                                    const width = ((drawEnd - drawStart) / chunkMins) * 100;
                                    
                                    const isBreak = b.type === 'break';
                                    const bgClass = isBreak ? 'bg-gray-300' : 'bg-red-200';
                                    const title = isBreak ? 'Přestávka' : 'Obsazeno';

                                    return (
                                        <div 
                                            key={i} 
                                            className={\`absolute top-0 bottom-0 \${bgClass} border-x border-white/50 z-10\`}
                                            style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                                            title={title}
                                        />
                                    );
                                })}

                                {/* Selected Time Block */}
                                {selStart !== null && selEnd !== null && (
                                    <>
                                        {/* Display Duration (The visible massage time) */}
                                        {(() => {
                                            if (displayEnd! <= chunk.start || selStart >= chunk.end) return null;
                                            const drawStart = Math.max(selStart, chunk.start);
                                            const drawEnd = Math.min(displayEnd!, chunk.end);
                                            const left = ((drawStart - chunk.start) / chunkMins) * 100;
                                            const width = ((drawEnd - drawStart) / chunkMins) * 100;
                                            return (
                                                <div 
                                                    className="absolute top-0 bottom-0 bg-gold border-2 border-gold-dark z-10 pointer-events-none shadow-md"
                                                    style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                                                >
                                                    {width > 15 && (
                                                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                                            <span className="text-xs font-bold text-white bg-black/30 px-2 py-0.5 rounded truncate">
                                                                {time} - {formatTime(displayEnd!)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* Buffer Duration (The 15 min hidden prep time) */}
                                        {(() => {
                                            if (selEnd <= chunk.start || displayEnd! >= chunk.end) return null;
                                            const drawStart = Math.max(displayEnd!, chunk.start);
                                            const drawEnd = Math.min(selEnd, chunk.end);
                                            const left = ((drawStart - chunk.start) / chunkMins) * 100;
                                            const width = ((drawEnd - drawStart) / chunkMins) * 100;
                                            return (
                                                <div 
                                                    className="absolute top-0 bottom-0 bg-gold/40 border-y-2 border-r-2 border-gold-dark border-dashed z-10 pointer-events-none"
                                                    style={{ left: \`\${left}%\`, width: \`\${width}%\` }}
                                                    title="Čas na přípravu (15 min)"
                                                />
                                            );
                                        })()}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-text-muted mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div> Volno</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-200 rounded"></div> Obsazeno</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 rounded"></div> Přestávka</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gold border border-gold-dark rounded"></div> Vaše rezervace</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gold/40 border-r border-dashed border-gold-dark rounded"></div> Příprava (15 min)</div>
            </div>
        </div>
    );
}`;

code = code.replace(regex, newComponent);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched public timeline chunks successfully');
