import React, { useState, useEffect, useRef } from 'react';
import { SERVICES_LIST } from '../constants';
import { X, Save, FileText, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function SearchableSelect({ options, value, onChange, placeholder, required }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((o: any) => 
        o.title.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find((o: any) => o.title === value);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-[#0a2f1c] border ${isOpen ? 'border-gold' : 'border-gold/20'} rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center`}
            >
                <span className={selectedOption ? "text-white" : "text-gray-400"}>
                    {selectedOption ? selectedOption.title : placeholder}
                </span>
                <ChevronDown size={18} className={`text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {required && <input type="text" className="absolute opacity-0 w-0 h-0 pointer-events-none" required value={value} onChange={() => {}} />}
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-[#0a2f1c] border border-gold/30 rounded-xl overflow-hidden shadow-2xl max-h-[60vh] sm:max-h-60 flex flex-col"
                    >
                        <div className="p-2 border-b border-gold/10">
                            <input 
                                type="text"
                                autoFocus
                                placeholder="Hledat..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-[#0f3d26] border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:border-gold outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">Nic nenalezeno</div>
                            ) : (
                                filteredOptions.map((o: any) => (
                                    <div 
                                        key={o.id}
                                        onClick={() => {
                                            onChange(o.title);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className="px-4 py-3 hover:bg-[#0f3d26] cursor-pointer flex justify-between items-center transition-colors border-b border-gold/5 last:border-0"
                                    >
                                        <div>
                                            <div className="text-white text-sm font-medium">{o.title}</div>
                                            <div className="text-gold text-xs">{o.price} {o.duration ? `• ${o.duration}` : ''}</div>
                                        </div>
                                        {value === o.title && <Check size={16} className="text-gold" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ManualReservationModal({ isOpen, onClose, onSave, reservations = [], specificDatesStr = "{}", openingHours = {} }: any) {
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [note, setNote] = useState('');
    
    const [serviceSearch, setServiceSearch] = useState('');
    const [addonSearch, setAddonSearch] = useState('');
    
    const [totalPrice, setTotalPrice] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (serviceSearch && time) {
            const service = SERVICES_LIST.find(s => s.title === serviceSearch);
            if (service && service.duration) {
                const durationMins = parseInt(service.duration.replace(/\D/g, '')) + 15;
                if (!isNaN(durationMins)) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const totalMins = (hours * 60) + minutes + durationMins;
                    const endH = Math.floor(totalMins / 60) % 24;
                    const endM = totalMins % 60;
                    setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
                }
            }
        }
    }, [serviceSearch, time]);

    useEffect(() => {
        let price = 0;
        const service = SERVICES_LIST.find(s => s.title === serviceSearch);
        if (service) {
            const p = parseInt(service.price.replace(/\D/g, ''));
            if (!isNaN(p)) price += p;
        }
        
        const addon = SERVICES_LIST.find(s => s.title === addonSearch);
        if (addon) {
            const p = parseInt(addon.price.replace(/\D/g, ''));
            if (!isNaN(p)) price += p;
        }
        
        if (service || addon) {
            setTotalPrice(price || '');
        } else if (!serviceSearch && !addonSearch) {
            setTotalPrice('');
        }
    }, [serviceSearch, addonSearch]);

    const handleSaveDraft = () => {
        const draft = { customerName, email, phone, date, time, note, serviceSearch, addonSearch, totalPrice };
        localStorage.setItem('manualReservationDraft', JSON.stringify(draft));
        alert('Koncept uložen.');
    };

    const handleLoadDraft = () => {
        const draftStr = localStorage.getItem('manualReservationDraft');
        if (draftStr) {
            try {
                const draft = JSON.parse(draftStr);
                setCustomerName(draft.customerName || '');
                setEmail(draft.email || '');
                setPhone(draft.phone || '');
                setDate(draft.date || '');
                setTime(draft.time || '');
                setNote(draft.note || '');
                setServiceSearch(draft.serviceSearch || '');
                setAddonSearch(draft.addonSearch || '');
                if (draft.totalPrice !== undefined) setTotalPrice(draft.totalPrice);
            } catch (e) {}
        } else {
            alert('Žádný uložený koncept nebyl nalezen.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const service = SERVICES_LIST.find(s => s.title === serviceSearch);
        if (!service) {
            setError('Vyberte prosím platnou službu ze seznamu.');
            return;
        }
        
        if (!date || !time || !customerName) {
            setError('Vyplňte prosím všechna povinná pole (Jméno, Datum, Čas, Masáž).');
            return;
        }

        if (time && endTime && reservations) {
            const parseTime = (t: string) => {
                if (!t) return 0;
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };
            const formatTime = (mins: number) => {
                const h = Math.floor(mins / 60) % 24;
                const m = Math.floor(mins % 60);
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            };
            const reqStart = parseTime(time);
            const reqEnd = parseTime(endTime);
            
            const dayReservations = reservations.filter((r: any) => r.date === date && r.status !== 'cancelled');
            for (const r of dayReservations) {
                let rStart = parseTime(r.time);
                let rEnd = rStart;
                if (r.endTime) {
                    rEnd = parseTime(r.endTime);
                } else {
                    const srv = SERVICES_LIST.find(s => s.id === r.serviceId);
                    if (srv && srv.duration) {
                        const m = srv.duration.match(/(\d+)/);
                        if (m) rEnd = rStart + parseInt(m[0]) + 15;
                        else rEnd = rStart + 60;
                    }
                }
                
                if (reqStart < rEnd && reqEnd > rStart) {
                    setError(`Zvolený čas se překrývá s existující rezervací (${r.time} - ${r.endTime || formatTime(rEnd)}).`);
                    return;
                }
            }
        }

        setLoading(true);
        let finalNote = note;
        const addon = SERVICES_LIST.find(s => s.title === addonSearch);
        if (addon) {
            finalNote = finalNote ? `${finalNote} (+ ${addon.title})` : `+ ${addon.title}`;
        } else if (addonSearch) {
            finalNote = finalNote ? `${finalNote} (+ ${addonSearch})` : `+ ${addonSearch}`;
        }

        try {
            const res = await fetch('/api/reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: Number(service.id),
                    date,
                    time,
                    endTime,
                    customerName,
                    email: email || 'neuvedeno@manual.cz',
                    phone: phone || '-',
                    note: finalNote,
                    totalPrice: Number(totalPrice) || 0,
                    isAdminManual: true
                })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.removeItem('manualReservationDraft');
                
                setCustomerName('');
                setEmail('');
                setPhone('');
                setDate('');
                setTime('');
                setNote('');
                setServiceSearch('');
                setAddonSearch('');
                setTotalPrice('');
                
                onSave();
                onClose();
            } else {
                setError(data.message || 'Chyba při ukládání');
            }
        } catch (err) {
            setError('Chyba při komunikaci se serverem');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const mainServices = SERVICES_LIST.filter(s => s.category !== 'doplnkove');
    const addons = SERVICES_LIST.filter(s => s.category === 'doplnkove');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="bg-[#0f3d26] sm:border border-gold/20 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl"
                >
                    <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-[#0a2f1c] rounded-t-3xl sm:rounded-t-2xl shrink-0">
                        <h2 className="text-xl font-serif text-gold">Přidat rezervaci</h2>
                        <div className="flex items-center gap-1 sm:gap-3">
                            <button onClick={handleLoadDraft} className="p-2 sm:px-3 sm:py-2 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg" title="Načíst koncept">
                                <FileText size={18} /> <span className="hidden sm:inline">Načíst</span>
                            </button>
                            <button onClick={handleSaveDraft} className="p-2 sm:px-3 sm:py-2 flex items-center gap-2 text-sm text-gold hover:text-white transition-colors hover:bg-gold/10 rounded-lg" title="Uložit koncept">
                                <Save size={18} /> <span className="hidden sm:inline">Uložit</span>
                            </button>
                            <div className="w-px h-6 bg-gold/10 mx-1 sm:mx-2"></div>
                            <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <form id="manual-reservation-form" onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Jméno zákazníka *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Telefon</label>
                                    <input 
                                        type="text" 
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">E-mail</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Datum *</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 sm:col-span-2">
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
                                </div>
                                
                                <div className="space-y-2 relative">
                                    <label className="text-sm text-gray-300">Služba / Masáž *</label>
                                    <SearchableSelect 
                                        options={mainServices}
                                        value={serviceSearch}
                                        onChange={setServiceSearch}
                                        placeholder="Vybrat službu..."
                                        required={true}
                                    />
                                </div>
                                
                                <div className="space-y-2 relative">
                                    <label className="text-sm text-gray-300">Doplněk</label>
                                    <SearchableSelect 
                                        options={addons}
                                        value={addonSearch}
                                        onChange={setAddonSearch}
                                        placeholder="Vybrat doplněk..."
                                        required={false}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Cena celkem (Kč)</label>
                                    <input 
                                        type="number" 
                                        value={totalPrice}
                                        onChange={e => setTotalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Poznámka</label>
                                <textarea 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    rows={3}
                                    className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none resize-none"
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="p-4 sm:p-6 border-t border-gold/10 bg-[#0a2f1c] rounded-b-none sm:rounded-b-2xl shrink-0">
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl border border-gold/20 text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button 
                                type="submit"
                                form="manual-reservation-form"
                                disabled={loading}
                                className="px-6 py-3 rounded-xl bg-gold text-black font-semibold hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Ukládám...' : 'Vytvořit rezervaci'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function TimelinePicker({ date, time, endTime, setTime, setEndTime, serviceSearch, reservations, specificDatesStr, openingHours }: any) {
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
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
                const m = srv.duration.match(/(\d+)/);
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
        const parsed = parseInt(service.duration.replace(/\D/g, ''));
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
                    const title = isBreak ? 'Přestávka' : `Rezervace (${b.customer})`;

                    return (
                        <div 
                            key={i} 
                            className={`absolute top-0 bottom-0 ${bgClass} border-x border-black/20`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                            title={title}
                        />
                    );
                })}

                {time && endTime && (
                    <div 
                        className="absolute top-0 bottom-0 bg-gold/50 border-2 border-gold rounded z-10 pointer-events-none flex items-center justify-center shadow-lg"
                        style={{ 
                            left: `${Math.max(0, ((parseTime(time) - sMins) / totalMins) * 100)}%`, 
                            width: `${Math.min(100, ((parseTime(endTime) - parseTime(time)) / totalMins) * 100)}%` 
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

