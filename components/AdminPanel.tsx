import React, { useState, useEffect } from 'react';
import { SERVICES_LIST } from '../constants';
import { ReservationStatus, Service } from '../types';
import { Settings, Calendar, LogOut, Check, X, Clock, DollarSign, Loader2, RefreshCw, CheckCircle, ShieldAlert, Mail, Gift, ChevronLeft, ChevronRight, Download, UploadCloud, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


const AdminDailySchedulePicker = ({ specificDatesStr, setSpecificDatesStr, updateSetting }: { specificDatesStr: string, setSpecificDatesStr: (s: string) => void, updateSetting: (k: string, v: any) => Promise<boolean> | void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
    
    let specificDates = {};
    try {
        if (typeof specificDatesStr === 'string') {
            let parsed = specificDatesStr ? JSON.parse(specificDatesStr) : {};
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            specificDates = parsed;
        } else if (typeof specificDatesStr === 'object') {
            specificDates = specificDatesStr;
        }
    } catch(e) {
        console.error("Failed to parse specificDatesStr", e);
        specificDates = {};
    }

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Start on Monday
    
    const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    
    const setDefaultsForMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        
        let updated = { ...specificDates };

        for (let i = 1; i <= days; i++) {
            const d = new Date(year, month, i);
            const dateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
            const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
            
            let isOpen = true;
            let start = '08:30';
            let end = '18:00';
            let breaks = [];
            
            if (dayOfWeek === 6) {
                isOpen = false;
            } else if (dayOfWeek === 0) {
                start = '09:00';
                end = '20:00';
            } else if (dayOfWeek === 5) {
                start = '08:30';
                end = '11:30';
            } else {
                start = '08:30';
                end = '18:00';
            }
            
            updated[dateString] = { isOpen, start, end, breaks };
        }
        
        const updatedStr = JSON.stringify(updated);
        setSpecificDatesStr(updatedStr);
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const selectedSettings = selectedDateStr ? (specificDates[selectedDateStr] || { isOpen: false, start: '09:00', end: '18:00', breaks: [] }) : null;

    const saveDaySettings = (newSettings: any) => {
        if (!selectedDateStr) return;
        const updated = { ...specificDates, [selectedDateStr]: newSettings };
        const updatedStr = JSON.stringify(updated);
        setSpecificDatesStr(updatedStr);
    };

    const toggleOpen = (checked: boolean) => {
        saveDaySettings({ ...selectedSettings, isOpen: checked });
    };

    const addBreak = () => {
        const breaks = [...(selectedSettings.breaks || []), { start: '12:00', end: '13:00' }];
        saveDaySettings({ ...selectedSettings, breaks });
    };

    const removeBreak = (idx: number) => {
        const breaks = [...(selectedSettings.breaks || [])];
        breaks.splice(idx, 1);
        saveDaySettings({ ...selectedSettings, breaks });
    };

    const updateBreak = (idx: number, field: string, val: string) => {
        const breaks = [...(selectedSettings.breaks || [])];
        breaks[idx] = { ...breaks[idx], [field]: val };
        saveDaySettings({ ...selectedSettings, breaks });
    };

    const handleSaveToServer = async () => {
        try {
            // First let's make sure we have the correct string representation
            const strToSave = typeof specificDatesStr === 'object' ? JSON.stringify(specificDatesStr) : specificDatesStr;
            // Send exactly the string to keep compatibility with double stringified or not
            const success = await updateSetting('specificDates', strToSave || "");
            if (success !== false) {
                alert('Změny v kalendáři byly úspěšně uloženy do databáze.');
            } else {
                alert('Chyba při ukládání do databáze.');
            }
        } catch(e) {
            console.error(e);
            alert('Chyba při ukládání.');
        }
    };
    
    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="bg-black/40 border border-gray-600/50 rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <h4 className="text-xl font-bold text-white tracking-wider">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h4>
                        <button 
                            onClick={setDefaultsForMonth} 
                            className="text-xs text-gold border border-gold/50 px-3 py-1 rounded hover:bg-gold hover:text-deep-green transition"
                        >
                            Nastavit defaultní pro tento měsíc
                        </button>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div>Po</div><div>Út</div><div>St</div><div>Čt</div><div>Pá</div><div>So</div><div>Ne</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startingDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-3" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        const isPast = dateString < new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        const settings = specificDates[dateString];
                        const isOpen = settings?.isOpen;
                        const isSelected = selectedDateStr === dateString;
                        
                        return (
                            <button
                                key={day}
                                onClick={() => !isPast && setSelectedDateStr(dateString)}
                                disabled={isPast}
                                className={`
                                    p-3 rounded flex items-center justify-center text-sm font-medium transition-all relative
                                    ${isPast ? 'opacity-20 cursor-not-allowed text-gray-500' : 'hover:border-gold border border-transparent'}
                                    ${isSelected ? 'border-gold bg-gold/20 shadow-[0_0_10px_rgba(197,168,128,0.5)]' : ''}
                                    ${!isPast && isOpen ? 'bg-green-900/40 text-green-400' : ''}
                                    ${!isPast && !isOpen ? 'bg-red-900/20 text-red-400/50' : ''}
                                `}
                            >
                                {day}
                                {isOpen && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-400"></div>}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-6 flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Otevřeno (nastaveno)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-900/20"></div> Zavřeno (nenastaveno)</div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-600/50">
                    <button 
                        onClick={handleSaveToServer}
                        className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Check size={20} />
                        Uložit změny v kalendáři na server
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedDateStr && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-black/30 border border-gold/30 rounded-xl p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-white">
                                Nastavení pro: <span className="text-gold">{new Date(selectedDateStr).toLocaleDateString('cs-CZ')}</span>
                            </h3>
                            <button onClick={() => setSelectedDateStr(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                        </div>

                        <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-gray-700 mb-6">
                            <span className="text-white font-medium">Otevřeno v tento den?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={selectedSettings.isOpen}
                                    onChange={(e) => toggleOpen(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        {selectedSettings.isOpen && (
                            <div className="space-y-6">
                                <div className="bg-black/20 p-4 rounded-lg border border-gray-700/50">
                                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">Pracovní doba</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block mb-1">Od</label>
                                            <input 
                                                type="text" 
                                                value={selectedSettings.start} 
                                                onChange={(e) => saveDaySettings({...selectedSettings, start: e.target.value})}
                                                className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                placeholder="09:00"
                                            />
                                        </div>
                                        <span className="text-gray-500 mt-5">-</span>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block mb-1">Do</label>
                                            <input 
                                                type="text" 
                                                value={selectedSettings.end} 
                                                onChange={(e) => saveDaySettings({...selectedSettings, end: e.target.value})}
                                                className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                placeholder="18:00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-4 rounded-lg border border-gray-700/50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Přestávky</h4>
                                        <button onClick={addBreak} className="text-xs bg-gold/20 text-gold px-2 py-1 rounded hover:bg-gold hover:text-white transition">+ Přidat přestávku</button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {(!selectedSettings.breaks || selectedSettings.breaks.length === 0) ? (
                                            <p className="text-sm text-gray-500 italic text-center py-2">Žádné přestávky nejsou nastaveny.</p>
                                        ) : (
                                            selectedSettings.breaks.map((br: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={br.start} 
                                                        onChange={(e) => updateBreak(idx, 'start', e.target.value)}
                                                        className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                        placeholder="12:00"
                                                    />
                                                    <span className="text-gray-500">-</span>
                                                    <input 
                                                        type="text" 
                                                        value={br.end} 
                                                        onChange={(e) => updateBreak(idx, 'end', e.target.value)}
                                                        className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                        placeholder="13:00"
                                                    />
                                                    <button onClick={() => removeBreak(idx)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded ml-2">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState(''); 
  const [loginError, setLoginError] = useState('');
  
  const [reservations, setReservations] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>(SERVICES_LIST); 
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings' | 'prices' | 'vouchers'>('reservations');
  const [clientSectionEnabled, setClientSectionEnabled] = useState(false);
  const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Úterý': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Středa': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Čtvrtek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Pátek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Sobota': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });
  const [specificDatesStr, setSpecificDatesStr] = useState<string>('');
  
  // Pagination state
  const [resPage, setResPage] = useState(1);
  const resItemsPerPage = 10;
  
  // Derived state for pagination
  const resTotalPages = Math.max(1, Math.ceil(reservations.length / resItemsPerPage));
  const currentReservations = reservations.slice((resPage - 1) * resItemsPerPage, resPage * resItemsPerPage);

  const fetchSettings = async () => {
    try {
        const res = await fetch('/api/settings');
        if (res.ok) {
            const data = await res.json();
            if (data.clientSectionEnabled) setClientSectionEnabled(data.clientSectionEnabled);
            if (data.specificDates) setSpecificDatesStr(data.specificDates);
        }
    } catch (e) {
        console.error(e);
    }
  };

  const fetchData = async (token: string) => {
    try {
        const res1 = await fetch('/api/admin/reservations', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res1.ok) {
            const data1 = await res1.json();
            setReservations(data1.reservations || []);
        }
        const res2 = await fetch('/api/admin/vouchers', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) {
            const data2 = await res2.json();
            setVouchers(data2.vouchers || []);
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result.success) {
                setAdminToken(result.token);
                setIsAuthenticated(true);
                fetchData(result.token);
                fetchSettings();
            } else {
                setLoginError('Nesprávné heslo');
            }
        } else {
            setLoginError('Chyba serveru - neplatná odpověď');
        }
    } catch (e) {
        setLoginError('Chyba spojení');
    } finally {
        setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ [key]: value })
        });
        if (!res.ok) {
            console.error('Failed to update setting', await res.text());
            return false;
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
  };

  const updateOpeningHours = (day: string, type: string, val: string) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], [type]: val }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };

  const updateOpeningHoursMulti = (day: string, updates: Record<string, string>) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], ...updates }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };

  const updateReservationStatus = async (id: number, status: string, reason?: string, alternativeTermin?: string) => {
    try {
        await fetch(`/api/admin/reservations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({ status, reason, alternativeTermin })
        });
        fetchData(adminToken);
    } catch (e) { console.error(e); }
  };

  const updateVoucherStatus = async (id: number, status: string, voucherCode?: string) => {
    try {
        await fetch(`/api/admin/vouchers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({ status, voucherCode })
        });
        fetchData(adminToken);
    } catch (e) { console.error(e); }
  };

  const handleBackup = async () => {
    try {
        const res = await fetch('/api/admin/backup', { headers: { 'Authorization': `Bearer ${adminToken}` } });
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup.json';
        a.click();
    } catch (e) { console.error(e); }
  };

  const [thankYouModalReservation, setThankYouModalReservation] = useState<any>(null);

  const [cancelModalReservation, setCancelModalReservation] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAlternativeTermin, setCancelAlternativeTermin] = useState('');

  const [rescheduleModalReservation, setRescheduleModalReservation] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const [backupRestoreMsg, setBackupRestoreMsg] = useState('');

  const handleOpenCancelModal = (res: any) => {
      setCancelModalReservation(res);
      setCancelReason('');
      setCancelAlternativeTermin('');
  };

  const openRescheduleModal = (res: any) => {
      setRescheduleModalReservation(res);
      setRescheduleDate('');
      setRescheduleTime('');
  };

  const handleReschedule = () => {
      if (!rescheduleDate || !rescheduleTime) return;
      updateReservationStatus(rescheduleModalReservation.id, 'rescheduled', undefined, rescheduleDate + ' ' + rescheduleTime);
      setRescheduleModalReservation(null);
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
          const text = await file.text();
          const json = JSON.parse(text);
          // Just a mock for now or real implementation
          setBackupRestoreMsg('Obnova dat úspěšná (Mock).');
          setTimeout(() => setBackupRestoreMsg(''), 3000);
      } catch (err) {
          setBackupRestoreMsg('Chyba při čtení souboru.');
      }
  };

  const confirmSendThankYouEmail = () => {
      if (thankYouModalReservation) {
          handleSendThankYou(thankYouModalReservation.id);
      }
  };


  const handleSendThankYou = async (id: number) => {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/admin/reservation/${id}/thankyou`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (response.ok) {
            alert('E-mail s poděkováním byl úspěšně odeslán.');
            setThankYouModalReservation(null);
        } else {
            alert('Nastala chyba při odesílání.');
        }
    } catch (e) {
         alert('Nastala chyba při odesílání (Server error).');
    } finally {
        setIsLoading(false);
    }
  };

  const updatePrice = async (id: number, newPrice: string) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const savePrice = async (id: number, price: string) => {
    alert("Ceník je aktuálně z dema, ukládání zatím není implementováno globálně.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-green bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="w-full max-w-md px-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleLogin} 
              className="bg-[#0f3d26] p-10 rounded-lg border border-gold/30 shadow-2xl relative overflow-hidden"
            >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark"></div>
            <h2 className="text-gold text-3xl mb-2 font-serif text-center tracking-wider">ADMINISTRACE</h2>
            <p className="text-gray-400 text-center text-sm mb-8 flex items-center justify-center gap-2">
                <ShieldAlert size={14} className="text-gold" /> Zabezpečený přístup
            </p>
            
            {loginError && (
                <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm text-center">
                    {loginError}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Přístupové heslo</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#0a2f1c] border border-gray-600 text-white rounded focus:border-gold outline-none transition"
                    placeholder="••••••••"
                    required
                />
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-gold text-deep-green font-bold py-3 rounded hover:bg-white transition-colors flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Vstoupit'}
            </button>
            </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-green text-gray-200 font-sans">
      <div className="bg-[#0f3d26] border-b border-gold/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl text-gold font-serif tracking-wide">Tereza Rozkošná <span className="text-gray-500 text-sm font-sans ml-2">/ Admin Panel</span></h1>
            <div className="flex items-center gap-4">
                <button onClick={() => fetchData(adminToken)} className="p-2 bg-[#0a2f1c] rounded-full hover:bg-gold hover:text-deep-green transition" title="Obnovit data">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => {
                  setIsAuthenticated(false);
                  window.location.hash = '';
                  window.location.href = '/';
                }} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                    <LogOut size={18} /> Odhlásit
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'reservations' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <Calendar size={18} /> Přehled Rezervací
            </button>
            <button 
                onClick={() => setActiveTab('vouchers')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'vouchers' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <Gift size={18} /> Dárkové poukazy
            </button>
            <button 
                onClick={() => setActiveTab('prices')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'prices' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <DollarSign size={18} /> Ceník Služeb
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'settings' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <Settings size={18} /> Nastavení
            </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'reservations' && (
               <motion.div 
                  key="reservations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] rounded-lg border border-gold/10 overflow-hidden shadow-xl"
               >
                  <div className="p-4 bg-[#0a2f1c] border-b border-gold/10 flex justify-between items-center">
                      <h3 className="text-white font-serif text-lg">Aktuální objednávky</h3>
                      <span className="text-sm text-gray-400">Celkem: {reservations.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                      {reservations.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                              {isLoading ? 'Načítám data...' : 'Žádné rezervace v databázi.'}
                          </div>
                      ) : (
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#0a2f1c] text-gold uppercase text-sm tracking-wider">
                              <tr>
                                  <th className="p-4 border-b border-gold/10">Datum & Čas</th>
                                  <th className="p-4 border-b border-gold/10">Klient</th>
                                  <th className="p-4 border-b border-gold/10 min-w-[250px]">Objednávka & Cena</th>
                                  <th className="p-4 border-b border-gold/10">Stav</th>
                                  <th className="p-4 border-b border-gold/10 max-w-[200px]">Akce</th>
                              </tr>
                          </thead>
                          <motion.tbody 
                              className="divide-y divide-gray-700"
                              variants={{
                                  hidden: { opacity: 0 },
                                  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                              }}
                              initial="hidden"
                              animate="show"
                          >
                              {currentReservations.map(res => (
                                  <motion.tr 
                                      key={res.id} 
                                      className="hover:bg-white/5 transition-colors"
                                      variants={{
                                          hidden: { opacity: 0, x: -20 },
                                          show: { opacity: 1, x: 0 }
                                      }}
                                  >
                                      <td className="p-4 whitespace-nowrap">
                                          <div className="font-bold text-white">{new Date(res.date).toLocaleDateString('cs-CZ')}</div>
                                          <div className="text-sm text-gray-400 flex items-center gap-1"><Clock size={12}/> {res.time}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{res.customerName}</div>
                                          <div className="text-xs text-gray-400">{res.phone}</div>
                                          <div className="text-xs text-gray-500">{res.email}</div>
                                      </td>
                                      <td className="p-4 text-xs">
                                          <div className="font-bold text-gold text-sm mb-1">
                                              {(() => {
                                                  const s = SERVICES_LIST.find(s => s.id === res.serviceId);
                                                  return s ? `${s.title} (${s.duration})` : res.serviceId;
                                              })()}
                                          </div>
                                          <div className="text-gray-400 whitespace-pre-wrap mt-2">{res.note || '-'}</div>
                                          {(res.totalPrice || res.vs) && (
                                              <div className="mt-3 text-gold/80 bg-gold/10 inline-flex flex-wrap items-center gap-3 px-2 py-1 rounded">
                                                  {res.totalPrice && <span className="font-medium text-gold">{res.totalPrice} Kč</span>}
                                                  {res.vs && <span>VS: {res.vs}</span>}
                                              </div>
                                          )}
                                      </td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              res.status === 'confirmed' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                                              res.status === 'paid' ? 'bg-green-900 text-green-200 border border-green-700' :
                                              res.status === 'cancelled' ? 'bg-red-900 text-red-200 border border-red-700' :
                                              'bg-yellow-900 text-yellow-200 border border-yellow-700'
                                          }`}>
                                              {res.status === 'pending' ? 'Nová žádost' : res.status === 'confirmed' ? 'Potvrzeno' : res.status === 'paid' ? 'Zaplaceno' : 'Zrušeno'}
                                          </span>
                                      </td>
                                      <td className="p-4 space-y-2">
                                          {res.status === 'pending' && (
                                              <div className="flex gap-2">
                                                  <button onClick={() => updateReservationStatus(res.id, 'confirmed')} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Potvrdit termín (pošle instrukce)">Potvrdit (e-mail)</button>
                                                  <button onClick={() => handleOpenCancelModal(res)} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded shadow-sm transition" title="Zamítnout"><X size={16}/></button>
                                              </div>
                                          )}
                                          {res.status === 'confirmed' && (
                                              <div className="flex gap-2">
                                                  <button onClick={() => updateReservationStatus(res.id, 'paid')} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Označit jako zaplaceno (pošle potvrzení)">Zaplaceno (e-mail)</button>
                                                  <button onClick={() => handleOpenCancelModal(res)} className="text-red-400 hover:text-red-300 text-xs underline p-2">Zrušit</button>
                                              </div>
                                          )}
                                          
                                          {(res.status === 'pending' || res.status === 'confirmed') && (
                                              <button 
                                                onClick={() => openRescheduleModal(res)} 
                                                className="w-full text-xs mt-1 bg-yellow-600/20 hover:bg-yellow-600 border border-yellow-600/50 text-yellow-500 hover:text-white px-2 py-1 rounded transition flex items-center justify-center gap-1"
                                              >
                                                <Calendar size={12} /> Změnit termín
                                              </button>
                                          )}

                                          <button 
                                            onClick={() => setThankYouModalReservation(res)} 
                                            className="w-full text-xs mt-1 bg-[#1a4a33] hover:bg-gold hover:text-deep-green border border-gold/30 text-white px-2 py-1 rounded transition flex items-center justify-center gap-1"
                                          >
                                            <Mail size={12} /> Poslat poděkování po masáži
                                          </button>
                                      </td>
                                  </motion.tr>
                              ))}
                          </motion.tbody>
                      </table>
                      )}

                      {resTotalPages > 1 && (
                          <div className="flex justify-between items-center bg-[#0a2f1c] p-4 border-t border-gold/10">
                              <span className="text-sm text-gray-400">
                                  Zobrazeno {(resPage - 1) * resItemsPerPage + 1} až {Math.min(resPage * resItemsPerPage, reservations.length)} z {reservations.length} rezervací
                              </span>
                              <div className="flex gap-2">
                                  <button
                                      disabled={resPage === 1}
                                      onClick={() => setResPage(Math.max(1, resPage - 1))}
                                      className="p-2 rounded bg-gray-800 text-white hover:bg-gold hover:text-deep-green disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  >
                                      <ChevronLeft size={16} />
                                  </button>
                                  <div className="flex gap-1 items-center px-2">
                                      {Array.from({ length: resTotalPages }).map((_, i) => (
                                          <button
                                              key={i}
                                              onClick={() => setResPage(i + 1)}
                                              className={`w-8 h-8 rounded text-sm transition-colors ${
                                                  resPage === i + 1 ? 'bg-gold text-deep-green font-bold' : 'bg-transparent text-gray-400 hover:text-white'
                                              }`}
                                          >
                                              {i + 1}
                                          </button>
                                      ))}
                                  </div>
                                  <button
                                      disabled={resPage === resTotalPages}
                                      onClick={() => setResPage(Math.min(resTotalPages, resPage + 1))}
                                      className="p-2 rounded bg-gray-800 text-white hover:bg-gold hover:text-deep-green disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  >
                                      <ChevronRight size={16} />
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
               </motion.div>
          )}

          {activeTab === 'vouchers' && (
               <motion.div 
                  key="vouchers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] rounded-lg border border-gold/10 overflow-hidden shadow-xl"
               >
                  <div className="p-4 bg-[#0a2f1c] border-b border-gold/10 flex justify-between items-center">
                      <h3 className="text-white font-serif text-lg">Žádosti o Dárkové Poukazy</h3>
                      <span className="text-sm text-gray-400">Celkem: {vouchers.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                      {vouchers.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                              {isLoading ? 'Načítám data...' : 'Žádné poukazy v databázi.'}
                          </div>
                      ) : (
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#0a2f1c] text-gold uppercase text-sm tracking-wider">
                              <tr>
                                  <th className="p-4 border-b border-gold/10">Datum</th>
                                  <th className="p-4 border-b border-gold/10">Dárce (Odesílatel)</th>
                                  <th className="p-4 border-b border-gold/10">Obdarovaný (Pro)</th>
                                  <th className="p-4 border-b border-gold/10">Typ & Částka</th>
                                  <th className="p-4 border-b border-gold/10">Jedinečný Kód</th>
                                  <th className="p-4 border-b border-gold/10">Stav</th>
                                  <th className="p-4 border-b border-gold/10">Akce</th>
                              </tr>
                          </thead>
                          <motion.tbody 
                              className="divide-y divide-gray-700"
                              variants={{
                                  hidden: { opacity: 0 },
                                  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                              }}
                              initial="hidden"
                              animate="show"
                          >
                              {vouchers.map(vouch => (
                                  <motion.tr 
                                      key={vouch.id} 
                                      className="hover:bg-white/5 transition-colors"
                                      variants={{
                                          hidden: { opacity: 0, x: -20 },
                                          show: { opacity: 1, x: 0 }
                                      }}
                                  >
                                      <td className="p-4 whitespace-nowrap">
                                          <div className="font-bold text-white">{new Date(vouch.createdAt || vouch.id).toLocaleDateString('cs-CZ')}</div>
                                          <div className="text-xs text-gray-400">{new Date(vouch.createdAt || vouch.id).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute:'2-digit'})}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{vouch.senderName}</div>
                                          <div className="text-xs text-gray-400">{vouch.email}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{vouch.recipientName}</div>
                                          {vouch.note && <div className="text-xs text-gold/75 italic mt-1 font-serif">"{vouch.note}"</div>}
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{vouch.summary}</div>
                                          <div className="text-xs text-gray-400">{vouch.amount} Kč</div>
                                      </td>
                                      <td className="p-4">
                                          {vouch.voucherCode ? (
                                              <span className="font-mono text-gold bg-black/30 px-2 py-1 rounded text-sm tracking-wider font-bold">{vouch.voucherCode}</span>
                                          ) : (
                                              <span className="text-gray-500 font-sans italic text-xs">&mdash;</span>
                                          )}
                                      </td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              vouch.status === 'paid' ? 'bg-green-900 text-green-200 border border-green-700' :
                                              vouch.status === 'cancelled' ? 'bg-red-900 text-red-200 border border-red-700' :
                                              'bg-yellow-900 text-yellow-200 border border-yellow-700'
                                          }`}>
                                              {vouch.status === 'pending' ? 'Čeká na zaplacení' : vouch.status === 'paid' ? 'Zaplaceno & Odesláno' : 'Zrušeno'}
                                          </span>
                                      </td>
                                      <td className="p-4">
                                          {vouch.status === 'pending' && (
                                              <div className="flex gap-2">
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm(`Opravdu si přejete potvrdit přijetí platby za poukaz pro '${vouch.recipientName}'? Tímto krokem bude vygenerován unikátní kód poukazu a odeslán dárci na e-mail: ${vouch.email}.`)) {
                                                              updateVoucherStatus(vouch.id, 'paid');
                                                          }
                                                      }} 
                                                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded shadow-sm transition text-xs font-bold"
                                                      title="Potvrdit platbu (vygeneruje kód a odesílá dárkový poukaz s unikátním číslem)"
                                                  >
                                                      Schválit & Odeslat poukaz
                                                  </button>
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm(`Opravdu chcete stornovat/zrušit tuto objednávku poukazu?`)) {
                                                              updateVoucherStatus(vouch.id, 'cancelled');
                                                          }
                                                      }} 
                                                      className="bg-red-600 hover:bg-red-550 border border-red-700/50 text-white p-2 rounded shadow-sm transition text-xs" 
                                                      title="Stornovat objednávku"
                                                  >
                                                      <X size={14}/>
                                                  </button>
                                              </div>
                                          )}
                                          {vouch.status === 'paid' && (
                                              <button 
                                                  onClick={() => {
                                                      if (confirm(`Opravdu chcete stornovat tento již schválený dárkový poukaz?`)) {
                                                          updateVoucherStatus(vouch.id, 'cancelled');
                                                      }
                                                  }}
                                                  className="text-red-400 hover:text-red-300 text-xs underline"
                                              >
                                                  Stornovat poukaz
                                              </button>
                                          )}
                                      </td>
                                  </motion.tr>
                              ))}
                          </motion.tbody>
                      </table>
                      )}
                  </div>
               </motion.div>
          )}

          {activeTab === 'prices' && (
              <motion.div 
                  key="prices"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] rounded-lg border border-gold/10 overflow-hidden shadow-xl p-6"
              >
                  <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                      <h3 className="text-xl text-white font-serif">Správa Ceníku</h3>
                      <p className="text-sm text-gray-400">Změny se ihned projeví na webu.</p>
                  </div>
                  <motion.div 
                      className="grid grid-cols-1 gap-4"
                      variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                      }}
                      initial="hidden"
                      animate="show"
                  >
                      {services.map((service) => (
                          <motion.div 
                              key={service.id} 
                              className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4"
                              variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  show: { opacity: 1, y: 0 }
                              }}
                          >
                              <div className="flex-1">
                                  <h4 className="font-bold text-gold text-lg">{service.title}</h4>
                                  <p className="text-sm text-gray-400">{service.description}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="flex flex-col">
                                      <label className="text-xs text-gray-500 uppercase">Cena</label>
                                      <input 
                                          type="text" 
                                          value={service.price} 
                                          onChange={(e) => updatePrice(service.id, e.target.value)}
                                          className="bg-black/20 border border-gray-600 text-white p-2 rounded w-32 focus:border-gold outline-none"
                                      />
                                  </div>
                                  <button 
                                      onClick={() => savePrice(service.id, service.price)}
                                      className="p-2 bg-gold/10 text-gold hover:bg-gold hover:text-deep-green rounded transition" 
                                      title="Uložit změnu"
                                  >
                                      <Check size={18} />
                                  </button>
                              </div>
                          </motion.div>
                      ))}
                  </motion.div>
              </motion.div>
          )}

          {activeTab === 'settings' && (
              <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] p-8 rounded-lg border border-gold/10 shadow-xl space-y-8"
              >
                  <div>
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Funkce na webu</h3>
                      <div className="bg-[#0a2f1c] p-6 rounded border border-gray-600 flex justify-between items-center">
                          <div>
                              <h4 className="font-bold text-gold">Klientská sekce (MediHub)</h4>
                              <p className="text-sm text-gray-400">Pokud je zapnuto, zobrazí se na hlavní stránce tlačítko a sekce.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={clientSectionEnabled}
                                onChange={(e) => updateSetting('clientSectionEnabled', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                          </label>
                      </div>
                  </div>

                                    <div>
                      
<h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Pracovní doba (Dle dnů)</h3>
<p className="text-sm text-gray-400 mb-6">Nastavte otevírací dobu a přestávky pro konkrétní dny. Dny, které nemají nastavenou otevírací dobu, jsou považovány za zavřené.</p>
<AdminDailySchedulePicker 
    specificDatesStr={specificDatesStr}
    setSpecificDatesStr={setSpecificDatesStr}
    updateSetting={updateSetting}
/>
</div>
<div className="pt-6 border-t border-gray-700">
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Záloha a obnova databáze</h3>
                      
                      {backupRestoreMsg && (
                          <div className="mb-4 text-sm font-semibold text-gold bg-gold/10 p-3 rounded">
                              {backupRestoreMsg}
                          </div>
                      )}

                      <div className="flex gap-4 flex-col md:flex-row">
                          <button 
                              onClick={handleBackup} 
                              className="bg-[#1a4a33] hover:bg-gold text-white hover:text-deep-green border border-gold/30 rounded px-6 py-3 flex items-center justify-center gap-2 transition font-bold"
                          >
                              <Download size={20} /> Stáhnout zálohu (JSON)
                          </button>
                          
                          <label className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-6 py-3 flex items-center justify-center gap-2 transition text-white cursor-pointer group">
                              <input 
                                  type="file" 
                                  accept=".json" 
                                  onChange={handleRestore} 
                                  className="hidden" 
                              />
                              <UploadCloud size={20} className="group-hover:text-gold transition" /> Nahrát zálohu ze souboru
                          </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Záloha obsahuje všechny rezervace, poukazy, nastavení i ceník.</p>
                  </div>

                                    <div className="pt-6 border-t border-gray-700 mt-6">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>
                       <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle size={16} />
                          <span>Interní lokální API spuštěno na portu 3000.</span>
                       </div>
                  </div>
              </motion.div>
          )}

          {cancelModalReservation && (
            <motion.div
              key="cancel-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#0f4d30] border border-gold/40 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
              >
                <button
                  type="button"
                  onClick={() => setCancelModalReservation(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
                
                <h4 className="text-xl text-white font-serif mb-3 flex items-center gap-2">
                  <X className="text-red-500" size={24} /> Zrušit rezervaci
                </h4>
                
                <p className="text-sm text-gray-200 mb-4 pb-2 border-b border-white/10">
                  Zákazník: <strong className="text-gold">{cancelModalReservation.customerName}</strong><br />
                  Termín: <strong className="text-white">{new Date(cancelModalReservation.date).toLocaleDateString('cs-CZ')} v {cancelModalReservation.time}</strong>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-1">
                      Důvod zrušení (bude odeslán v e-mailu)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Uveďte důvod zrušení (např. Naléhavá zdravotní indispozice...)"
                      className="w-full bg-[#072415] border border-gray-600 rounded p-2 text-white text-sm focus:border-gold outline-none h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-1">
                      Navrhnout náhradní termín z volných (volitelné)
                    </label>
                                        <div className="flex gap-2 mb-4">
                        <input 
                            type="date" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => {
                                const d = e.target.value;
                                if (d) {
                                    const dObj = new Date(d);
                                    setCancelAlternativeTermin(`${dObj.getDate()}.${dObj.getMonth()+1}.${dObj.getFullYear()} - čeká na čas`);
                                }
                            }} 
                        />
                        <input 
                            type="time" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => {
                                const t = e.target.value;
                                setCancelAlternativeTermin(prev => prev.replace(' - čeká na čas', '') + ' v ' + t);
                            }} 
                        />
                    </div>
                    {cancelAlternativeTermin && (
                        <div className="mt-2 text-sm text-gold">Vybraný náhradní termín: <strong>{cancelAlternativeTermin}</strong></div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setCancelModalReservation(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white rounded py-2 text-sm transition"
                  >
                    Storno
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateReservationStatus(cancelModalReservation.id, 'cancelled', cancelReason, cancelAlternativeTermin);
                      setCancelModalReservation(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded py-2 text-sm font-semibold transition"
                  >
                    Potvrdit zrušení
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {rescheduleModalReservation && (
            <motion.div
              key="reschedule-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setRescheduleModalReservation(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a2f1c] border border-gold/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              >
                <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition" onClick={() => setRescheduleModalReservation(null)}>
                  <X size={20} />
                </div>
                
                <h4 className="text-xl text-white font-serif mb-3 flex items-center gap-2">
                  <Calendar className="text-yellow-500" size={24} /> Změnit termín
                </h4>
                
                <p className="text-sm text-gray-200 mb-4 pb-2 border-b border-white/10">
                  Změňte termín na základě dohody (vybráním nového se starý přepíše a klientovi dorazí e-mail).<br/><br/>
                  Zákazník: <strong className="text-gold">{rescheduleModalReservation.customerName}</strong>
                </p>

                                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => setRescheduleDate(e.target.value)} 
                        />
                        <input 
                            type="time" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => setRescheduleTime(e.target.value)} 
                        />
                    </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalReservation(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white rounded py-2 text-sm transition"
                  >
                    Zrušit
                  </button>
                  <button
                    type="button"
                    onClick={handleReschedule}
                    disabled={isLoading || !rescheduleDate || !rescheduleTime}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded py-2 text-sm font-semibold transition disabled:opacity-50"
                  >
                    {isLoading ? 'Měním...' : 'Změnit a odeslat'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {thankYouModalReservation && (
            <motion.div
              key="thank-you-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setThankYouModalReservation(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a2f1c] border border-gold/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              >
                <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition" onClick={() => setThankYouModalReservation(null)}>
                  <X size={20} />
                </div>
                
                <div className="flex items-center gap-3 text-gold mb-4 border-b border-gray-700 pb-3">
                  <Mail size={24} />
                  <h3 className="text-xl font-bold font-serif">Odeslat poděkování</h3>
                </div>

                <div className="text-sm text-gray-300 mb-6 bg-[#072415] rounded p-3 border border-gray-700/50">
                  <p className="mb-2">Chystáte se odeslat děkovný e-mail za dnešní masáž klientovi:</p>
                  <p>Zákazník: <strong className="text-gold">{thankYouModalReservation.customerName}</strong><br />
                  E-mail: <strong className="text-white">{thankYouModalReservation.email}</strong></p>
                </div>

                <div className="text-sm text-gray-400 mb-6 font-light">
                  <p>Tento e-mail obsahuje text s poděkováním za návštěvu, nabídkou pitného režimu a rozloučením.</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setThankYouModalReservation(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white rounded py-2 text-sm transition"
                  >
                    Storno
                  </button>
                  <button
                    type="button"
                    onClick={confirmSendThankYouEmail}
                    disabled={isLoading}
                    className="flex-1 bg-[#1a4a33] hover:bg-gold hover:text-deep-green text-white rounded py-2 text-sm font-semibold transition border border-gold/30 disabled:opacity-50"
                  >
                    {isLoading ? 'Odesílám...' : 'Odeslat e-mail'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;