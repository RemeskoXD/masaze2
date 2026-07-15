import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock, Mail, Check, AlertCircle, Edit2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES_LIST } from '../constants';

interface ReservationCalendarProps {
    reservations: any[];
    updateReservationStatus: (id: number, status: string) => void;
    handleOpenCancelModal: (res: any) => void;
    openRescheduleModal: (res: any) => void;
    setThankYouModalReservation: (res: any) => void;
    editReservation?: (id: number, data: any) => void;
    specificDatesStr?: string;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 80;

const normalizeDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) return d;
    const parts = d.split('.');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return d;
};

export default function ReservationCalendar({
    reservations,
    updateReservationStatus,
    handleOpenCancelModal,
    openRescheduleModal,
    setThankYouModalReservation,
    editReservation,
    specificDatesStr
}: ReservationCalendarProps) {
    const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    
    // For manual date picker
    const [dateInputVal, setDateInputVal] = useState(selectedDate);
    useEffect(() => { setDateInputVal(selectedDate); }, [selectedDate]);

    const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    let specificDates: any = {};
    try {
        if (typeof specificDatesStr === 'string') {
            let parsed = specificDatesStr ? JSON.parse(specificDatesStr) : {};
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            specificDates = parsed;
        } else if (typeof specificDatesStr === 'object') {
            specificDates = specificDatesStr;
        }
    } catch(e) {}

    useEffect(() => {
        if (viewMode === 'day' && scrollContainerRef.current) {
            const now = new Date();
            const currentHour = now.getHours();
            if (currentHour >= START_HOUR && currentHour <= END_HOUR) {
                const scrollTo = (currentHour - START_HOUR) * HOUR_HEIGHT;
                scrollContainerRef.current.scrollTop = Math.max(0, scrollTo - 100);
            }
        }
    }, [selectedDate, viewMode]);

    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };
    
    const changeMonth = (months: number) => {
        const date = new Date(selectedDate);
        date.setMonth(date.getMonth() + months);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('cs-CZ', options);
    };
    
    const formatMonth = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString('cs-CZ', options);
    };

    const dayReservations = useMemo(() => {
        return reservations.filter(r => normalizeDate(r.date) === selectedDate && r.status !== 'cancelled').sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, selectedDate]);

    const getReservationStyle = (res: any) => {
        const [hours, minutes] = res.time.split(':').map(Number);
        let durationMins = 60;
        const service = SERVICES_LIST.find(s => s.id === res.serviceId);
        if (service && service.duration) {
            const parsed = parseInt(service.duration.replace(/\D/g, ''));
            if (!isNaN(parsed)) durationMins = parsed + 15; // + 15 min reserve
        }
        const startMinutesFromTop = ((hours - START_HOUR) * 60) + minutes;
        const top = (startMinutesFromTop / 60) * HOUR_HEIGHT;
        let height = (durationMins / 60) * HOUR_HEIGHT;
        const resDateTime = new Date(`${res.date}T${res.time}`);
        const isPast = resDateTime < new Date();
        
        // Calculate end time
        const endMinutes = minutes + durationMins;
        const endHours = hours + Math.floor(endMinutes / 60);
        const remainingEndMinutes = endMinutes % 60;
        let endTimeStr = `${endHours.toString().padStart(2, '0')}:${remainingEndMinutes.toString().padStart(2, '0')}`;
        
        if (res.endTime) {
            endTimeStr = res.endTime;
            const [endH, endM] = res.endTime.split(':').map(Number);
            const durationCustom = ((endH - hours) * 60) + (endM - minutes);
            if (durationCustom > 0) {
                height = (durationCustom / 60) * HOUR_HEIGHT;
            }
        }

        return { top: `${top}px`, height: `${Math.max(height, 30)}px`, isPast, endTimeStr };
    };
    
    const handleEditChange = (e: any) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };
    
    const saveEdit = () => {
        if (editReservation && selectedReservation) {
            // Need to parse serviceId to number
            const toSave = { ...editFormData };
            if (toSave.serviceId) toSave.serviceId = parseInt(toSave.serviceId);
            editReservation(selectedReservation.id, toSave);
            setSelectedReservation({ ...selectedReservation, ...toSave });
            setIsEditing(false);
        }
    };
    
    const renderMonthView = () => {
        const curr = new Date(selectedDate);
        const year = curr.getFullYear();
        const month = curr.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mon = 0
        
        const days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        
        return (
            <div className="flex-1 overflow-y-auto bg-[#0a2f1c] p-2 sm:p-4">
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-medium text-gold/80 mb-2">
                    <div>Po</div><div>Út</div><div>St</div><div>Čt</div><div>Pá</div><div>So</div><div>Ne</div>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
                    {days.map((day, idx) => {
                        if (!day) return <div key={idx} className="bg-black/10 rounded-lg min-h-[80px]"></div>;
                        const dateStr = new Date(day.getTime() - day.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        const todayStr = new Date().toISOString().split('T')[0];
                        const isToday = dateStr === todayStr;
                        const isPast = dateStr < todayStr;
                        const isSelected = dateStr === selectedDate;
                        const daySettings = specificDates[dateStr];
                        const isClosed = !daySettings || !daySettings.isOpen;
                        
                        const resForDay = reservations.filter(r => normalizeDate(r.date) === dateStr && r.status !== 'cancelled');
                        
                        return (
                            <div 
                                key={idx} 
                                onClick={() => { setSelectedDate(dateStr); setViewMode('day'); }}
                                className={`min-h-[80px] sm:min-h-[100px] border rounded-lg p-1 sm:p-2 cursor-pointer transition flex flex-col ${isClosed ? 'bg-red-900/10 border-red-900/30' : 'bg-[#0f3d26] hover:border-gold/50'} ${isSelected ? 'ring-2 ring-gold' : 'border-gold/10'} ${isPast && !isToday ? 'opacity-40 grayscale' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-gold text-deep-green' : 'text-gray-300'}`}>
                                        {day.getDate()}
                                    </span>
                                </div>
                                
                                {isClosed && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <span className="text-[10px] sm:text-xs text-red-500/50 uppercase tracking-wider font-bold rotate-[-15deg]">Zavřeno</span>
                                    </div>
                                )}
                                
                                {!isClosed && resForDay.length > 0 && (
                                    <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                                        {resForDay.slice(0, 3).map((r, i) => (
                                            <div key={i} className={`text-[10px] truncate px-1 py-0.5 rounded shadow-sm ${r.status === 'confirmed' ? 'bg-blue-900/80 text-blue-200' : r.status === 'paid' ? 'bg-green-900/80 text-green-200' : 'bg-yellow-600/30 text-yellow-500'}`}>
                                                {r.time} {r.customerName}
                                            </div>
                                        ))}
                                        {resForDay.length > 3 && (
                                            <div className="text-[10px] text-gray-400 text-center">+{resForDay.length - 3} další</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const daySettings = specificDates[selectedDate];
        const isClosed = !daySettings || !daySettings.isOpen;
        
        return (
            <div className="flex-1 overflow-y-auto relative bg-[#0a2f1c]/50" ref={scrollContainerRef}>
                {isClosed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/5 text-red-500 z-0">
                        <AlertCircle size={48} className="opacity-20 mb-4" />
                        <h2 className="text-2xl font-bold opacity-30 uppercase tracking-widest">Zavřeno</h2>
                        <p className="opacity-50 mt-2">Na tento den nejsou povoleny rezervace.</p>
                    </div>
                ) : null}
                <div className="relative min-w-[300px]">
                    {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
                        const h = START_HOUR + i;
                        const hStr = h.toString().padStart(2, '0') + ':00';
                        // Check if this specific hour is outside the opening hours
                        let isHourClosed = false;
                        if (daySettings && daySettings.isOpen !== false) {
                            if (daySettings.start && hStr < daySettings.start) isHourClosed = true;
                            if (daySettings.end && hStr >= daySettings.end) isHourClosed = true;
                        }
                        
                        return (
                            <div key={i} className="flex border-b border-gold/5" style={{ height: `${HOUR_HEIGHT}px` }}>
                                <div className="w-16 sm:w-20 shrink-0 border-r border-gold/10 flex justify-center py-2 text-xs sm:text-sm text-gray-400 font-mono bg-[#0f3d26]/50">
                                    {hStr}
                                </div>
                                <div className={`flex-1 relative ${isHourClosed && !isClosed ? 'bg-red-900/10' : ''}`}>
                                    {isHourClosed && !isClosed && <span className="absolute left-2 top-2 text-xs text-red-500/30 uppercase tracking-widest">Zavřeno</span>}
                                </div>
                            </div>
                        )
                    })}

                    <div className="absolute top-0 left-16 sm:left-20 right-0 bottom-0 p-1 sm:p-2 pointer-events-none">
                        {dayReservations.map((res) => {
                            const { top, height, isPast, endTimeStr } = getReservationStyle(res);
                            const service = SERVICES_LIST.find(s => s.id === res.serviceId);
                            const sName = service ? service.title : res.serviceId;
                            
                            let bgColor = isPast ? 'bg-gray-800 border-gray-600' : 'bg-[#1a4a33] border-gold/40 hover:border-gold';
                            if (!isPast && res.status === 'confirmed') bgColor = 'bg-blue-900/80 border-blue-500/50 hover:border-blue-400';
                            if (!isPast && res.status === 'paid') bgColor = 'bg-green-900/80 border-green-500/50 hover:border-green-400';
                            
                            return (
                                <div 
                                    key={res.id}
                                    onClick={() => setSelectedReservation(res)}
                                    className={`absolute left-1 sm:left-2 right-1 sm:right-2 rounded-lg border p-2 sm:p-3 overflow-hidden cursor-pointer pointer-events-auto transition-all shadow-md group ${bgColor} ${isPast ? 'opacity-60 grayscale' : 'hover:scale-[1.01] hover:shadow-lg hover:z-10'}`}
                                    style={{ top, height }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium text-white text-sm sm:text-base truncate group-hover:text-gold transition-colors">{res.customerName}</div>
                                        <div className="text-xs bg-black/30 px-2 py-0.5 rounded text-gray-300 font-mono">{res.time} - {endTimeStr}</div>
                                    </div>
                                    <div className={`text-xs mt-1 truncate ${isPast ? 'text-gray-400' : 'text-gold/80'}`}>
                                        {sName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#0f3d26] rounded-xl sm:rounded-2xl border border-gold/10 overflow-hidden flex flex-col h-[70vh] sm:h-[80vh] shadow-xl">
            <div className="p-3 sm:p-4 bg-[#0a2f1c] border-b border-gold/10 flex flex-col sm:flex-row justify-between items-center z-10 shrink-0 gap-3">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'month' ? 'bg-gold text-deep-green shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >Měsíc</button>
                    <button 
                        onClick={() => setViewMode('day')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'day' ? 'bg-gold text-deep-green shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >Den</button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={() => viewMode === 'month' ? changeMonth(-1) : changeDate(-1)} className="p-2 bg-white/5 hover:bg-gold/10 text-gray-300 hover:text-gold rounded-lg transition-colors flex items-center">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center mx-2 flex flex-col items-center">
                        {viewMode === 'day' ? (
                            <input 
                                type="date" 
                                value={dateInputVal}
                                onChange={(e) => {
                                    setDateInputVal(e.target.value);
                                    if (e.target.value) setSelectedDate(e.target.value);
                                }}
                                className="bg-transparent border-none text-gold font-serif text-lg sm:text-xl capitalize outline-none cursor-pointer text-center"
                                style={{ colorScheme: 'dark' }}
                            />
                        ) : (
                            <div className="text-gold font-serif text-lg sm:text-xl capitalize">{formatMonth(selectedDate)}</div>
                        )}
                        {viewMode === 'day' && <div className="text-xs text-gray-400 mt-1">{dayReservations.length} rezervací</div>}
                    </div>
                    <button onClick={() => viewMode === 'month' ? changeMonth(1) : changeDate(1)} className="p-2 bg-white/5 hover:bg-gold/10 text-gray-300 hover:text-gold rounded-lg transition-colors flex items-center">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {viewMode === 'month' ? renderMonthView() : renderDayView()}

            <AnimatePresence>
                {selectedReservation && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="bg-[#0f3d26] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gold/20 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-4 sm:p-6 bg-[#0a2f1c] border-b border-gold/10 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-xl font-serif text-gold">
                                        {isEditing ? 'Úprava rezervace' : selectedReservation.customerName}
                                    </h3>
                                    {!isEditing && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                            <CalendarIcon size={14} /> {formatDate(selectedReservation.date)}
                                            <Clock size={14} className="ml-2" /> {selectedReservation.time}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditing && editReservation && (
                                        <button onClick={() => { setIsEditing(true); setEditFormData(selectedReservation); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Upravit">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => { setSelectedReservation(null); setIsEditing(false); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Jméno</label>
                                            <input type="text" name="customerName" value={editFormData.customerName || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Datum</label>
                                                <input type="date" name="date" value={editFormData.date || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" style={{ colorScheme: 'dark' }} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Čas</label>
                                                <input type="time" name="time" value={editFormData.time || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" style={{ colorScheme: 'dark' }} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Telefon</label>
                                                <input type="text" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">E-mail</label>
                                                <input type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Služba</label>
                                            <select name="serviceId" value={editFormData.serviceId || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold">
                                                {SERVICES_LIST.map(s => (
                                                    <option key={s.id} value={s.id} className="bg-[#0f3d26]">{s.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Cena (Kč)</label>
                                            <input type="number" name="totalPrice" value={editFormData.totalPrice || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Poznámka</label>
                                            <textarea name="note" value={editFormData.note || ''} onChange={handleEditChange} className="w-full bg-black/20 border border-gold/20 rounded-lg p-2 text-white focus:outline-none focus:border-gold min-h-[80px]"></textarea>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-black/30 hover:bg-black/50 text-white p-3 rounded-lg transition text-sm">Zrušit</button>
                                            <button onClick={saveEdit} className="flex-1 bg-gold text-deep-green hover:bg-white p-3 rounded-lg transition text-sm font-bold flex items-center justify-center gap-2">
                                                <Save size={16} /> Uložit změny
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-black/20 rounded-xl p-4 space-y-3 border border-gold/5">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">Služba</div>
                                                <div className="text-sm text-white font-medium">
                                                    {(() => {
                                                        const s = SERVICES_LIST.find(s => s.id === selectedReservation.serviceId);
                                                        return s ? `${s.title} (${s.duration})` : selectedReservation.serviceId;
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Telefon</div>
                                                    <div className="text-sm text-white">{selectedReservation.phone || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">E-mail</div>
                                                    <div className="text-sm text-white truncate">{selectedReservation.email || '-'}</div>
                                                </div>
                                            </div>
                                            {selectedReservation.note && (
                                                <div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Poznámka</div>
                                                    <div className="text-sm text-white bg-black/20 p-2 rounded-lg mt-1">{selectedReservation.note}</div>
                                                </div>
                                            )}
                                            {(selectedReservation.totalPrice || selectedReservation.vs) && (
                                                <div className="flex flex-wrap gap-3 pt-2 border-t border-gold/5">
                                                    {selectedReservation.totalPrice && <div className="text-sm"><span className="text-gray-500">Cena:</span> <span className="text-gold font-medium">{selectedReservation.totalPrice} Kč</span></div>}
                                                    {selectedReservation.vs && <div className="text-sm"><span className="text-gray-500">VS:</span> <span className="text-white">{selectedReservation.vs}</span></div>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Akce k rezervaci</div>
                                            
                                            {selectedReservation.status === 'pending' && (
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button onClick={() => { updateReservationStatus(selectedReservation.id, 'confirmed'); setSelectedReservation(null); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl shadow-sm transition flex-1 text-sm font-medium flex items-center justify-center gap-2">
                                                        <Check size={16} /> Potvrdit termín (e-mail)
                                                    </button>
                                                    <button onClick={() => { handleOpenCancelModal(selectedReservation); setSelectedReservation(null); }} className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white border border-red-700/50 px-4 py-3 rounded-xl shadow-sm transition text-sm font-medium">
                                                        Zamítnout
                                                    </button>
                                                </div>
                                            )}
                                            {selectedReservation.status === 'confirmed' && (
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button onClick={() => { updateReservationStatus(selectedReservation.id, 'paid'); setSelectedReservation(null); }} className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl shadow-sm transition flex-1 text-sm font-medium flex items-center justify-center gap-2">
                                                        <Check size={16} /> Označit jako zaplaceno
                                                    </button>
                                                    <button onClick={() => { handleOpenCancelModal(selectedReservation); setSelectedReservation(null); }} className="bg-black/20 hover:bg-red-900/30 text-red-400 px-4 py-3 rounded-xl transition text-sm font-medium border border-transparent hover:border-red-900/50">
                                                        Zrušit termín
                                                    </button>
                                                </div>
                                            )}
                                            {(selectedReservation.status === 'pending' || selectedReservation.status === 'confirmed') && (
                                                <button
                                                    onClick={() => { openRescheduleModal(selectedReservation); setSelectedReservation(null); }}
                                                    className="w-full bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    <CalendarIcon size={16} /> Změnit termín (odeslat e-mail)
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setThankYouModalReservation(selectedReservation); setSelectedReservation(null); }}
                                                className="w-full bg-[#1a4a33] hover:bg-gold hover:text-deep-green border border-gold/30 text-white px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm font-medium"
                                            >
                                                <Mail size={16} /> Poslat poděkování po masáži
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
