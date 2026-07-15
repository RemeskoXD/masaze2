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

export default function ManualReservationModal({ isOpen, onClose, onSave }: any) {
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
        if (serviceSearch && time && !endTime) {
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
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Čas *</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Konec (rezerva 15m)</label>
                                    <input 
                                        type="time" 
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
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
