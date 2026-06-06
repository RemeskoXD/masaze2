import React, { useState, useEffect } from 'react';
import { SERVICES_LIST } from '../constants';
import { ReservationStatus, Service } from '../types';
import { Settings, Calendar, LogOut, Check, X, Clock, DollarSign, Loader2, RefreshCw, CheckCircle, ShieldAlert, Mail, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    'Pondělí': { start: '09:00', end: '18:00' },
    'Úterý': { start: '09:00', end: '18:00' },
    'Středa': { start: '09:00', end: '18:00' },
    'Čtvrtek': { start: '09:00', end: '18:00' },
    'Pátek': { start: '09:00', end: '18:00' },
    'Sobota': { start: '09:00', end: '18:00' },
    'Neděle': { start: '09:00', end: '18:00' }
  });

  // Pagination for reservations
  const [resPage, setResPage] = useState(1);
  const resItemsPerPage = 10;
  const resTotalPages = Math.ceil(reservations.length / resItemsPerPage);
  const paginatedReservations = reservations.slice((resPage - 1) * resItemsPerPage, resPage * resItemsPerPage);

  // States for cancellation dialog
  const [cancelModalReservation, setCancelModalReservation] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAlternativeTermin, setCancelAlternativeTermin] = useState('');

  // States for thank you dialog
  const [thankYouModalReservation, setThankYouModalReservation] = useState<any | null>(null);

  // States for reschedule dialog
  const [rescheduleModalReservation, setRescheduleModalReservation] = useState<any | null>(null);
  const [rescheduleMonth, setRescheduleMonth] = useState(new Date());
  const [rescheduleDate, setRescheduleDate] = useState<string | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);

  // Calendar logic directly replicated for admin selection
  const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = null) => {
    if (!serviceId) return [];
    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
    
    let duration = 60;
    const mMatch = service.duration.match(/(\d+)/);
    if (mMatch) duration = parseInt(mMatch[0]);

    selectedAddons.forEach(addonId => {
      const addon = SERVICES_LIST.find(s => s.id === addonId);
      if (addon) {
          const am = addon.duration.match(/(\d+)/);
          if (am) duration += parseInt(am[0]);
      }
    });

    let dayOfWeek = 'Pondělí';
    if (dateStr) {
      const d = new Date(dateStr);
      dayOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][d.getDay()];
    }

    const daySettings = openingHours[dayOfWeek];
    if (!daySettings || !daySettings.start || !daySettings.end) return []; // ZAVRENO

    const startParts = daySettings.start.split(':');
    const endParts = daySettings.end.split(':');
    
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    let gap = duration <= 30 ? 15 : 30;
    const totalBlockMinutes = duration + gap;
    const slots = [];
    
    let currentMinutes = startMinutes;
    
    while (currentMinutes + duration <= endMinutes) {
        const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
        const m = (currentMinutes % 60).toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        currentMinutes += totalBlockMinutes;
    }
    return slots;
  };

  const generateCalendarDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Monday as 0

    const days = [];
    for (let i = 0; i < startingDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  };

  const openRescheduleModal = (resObj: any) => {
      setRescheduleModalReservation(resObj);
      setRescheduleDate(null);
      setRescheduleTime(null);
      setRescheduleMonth(new Date());
  };

  const handleReschedule = async () => {
    if (!rescheduleModalReservation || !rescheduleDate || !rescheduleTime) return;
    setIsLoading(true);
    
    // Formatting date to DD.MM.YYYY
    const dObj = new Date(rescheduleDate);
    const formattedDate = `${dObj.getDate()}.${dObj.getMonth() + 1}.${dObj.getFullYear()}`;

    try {
        const response = await fetch(`/api/admin/reservation/${rescheduleModalReservation.id}/reschedule`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ newDate: formattedDate, newTime: rescheduleTime })
        });
        if (response.ok) {
            setReservations(reservations.map(res => res.id === rescheduleModalReservation.id ? { ...res, date: formattedDate, time: rescheduleTime } : res));
            setRescheduleModalReservation(null);
        } else {
            alert('Chyba při změně termínu.');
        }
    } catch (e) {
        alert('Server error při změně termínu.');
    } finally {
        setIsLoading(false);
    }
  };

  // Reusable Calendar Component for both Modals
  const AdminCalendar = ({ 
      selectedServiceId, 
      addons, 
      onSelectDateTime 
  }: { 
      selectedServiceId: number, 
      addons?: number[], 
      onSelectDateTime: (d: string, t: string) => void 
  }) => {
      const [calMonth, setCalMonth] = useState(new Date());
      const [selDate, setSelDate] = useState<string | null>(null);
      const [selTime, setSelTime] = useState<string | null>(null);

      const days = generateCalendarDays(calMonth);
      const slots = generateTimeSlots(selectedServiceId, addons || [], selDate);

      const nextMonth = () => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1));
      const prevMonth = () => {
          const today = new Date();
          if (calMonth.getMonth() > today.getMonth() || calMonth.getFullYear() > today.getFullYear()) {
              setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1));
          }
      };

      const handleTimePick = (t: string) => {
          setSelTime(t);
          if (selDate) onSelectDateTime(selDate, t);
      };

      return (
          <div className="bg-[#072415] border border-gold/20 rounded p-4 mt-4">
              <div className="flex justify-between items-center mb-4 text-gold shrink-0">
                  <button onClick={prevMonth} type="button" className="p-1 hover:text-white"><Calendar size={16} /></button>
                  <span className="font-bold">{calMonth.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={nextMonth} type="button" className="p-1 hover:text-white"><Calendar size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                  {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                  {days.map((date, idx) => {
                      if (!date) return <div key={idx} className="p-1"></div>;
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selDate === dateStr;
                      const isPast = date < new Date() && date.toDateString() !== new Date().toDateString();
                      
                      return (
                          <button
                              key={dateStr}
                              type="button"
                              onClick={() => { setSelDate(dateStr); setSelTime(null); }}
                              disabled={isPast}
                              className={`p-2 text-center rounded text-sm transition-all ${
                                  isSelected ? 'bg-gold text-deep-green font-bold' : isPast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gold/20 text-white'
                              }`}
                          >
                              {date.getDate()}
                          </button>
                      );
                  })}
              </div>
              
              {selDate && (
                  <div className="mt-4 pt-4 border-t border-gold/20">
                      <h4 className="text-sm text-gold mb-2">Vybrat čas:</h4>
                      <div className="grid grid-cols-4 gap-2">
                          {slots.map(t => {
                              // is taken?
                              // Formatoed date check
                              const dO = new Date(selDate);
                              const fDate = `${dO.getDate()}.${dO.getMonth() + 1}.${dO.getFullYear()}`;
                              const isTaken = reservations.some(r => r.date === fDate && r.time === t && r.status !== 'cancelled');

                              return (
                                  <button
                                      key={t}
                                      type="button"
                                      disabled={isTaken}
                                      onClick={() => handleTimePick(t)}
                                      className={`py-1 text-xs rounded transition-all ${
                                          selTime === t ? 'bg-white text-deep-green font-bold' : isTaken ? 'opacity-20 line-through cursor-not-allowed' : 'bg-[#1a4a33] hover:bg-gold text-white hover:text-deep-green border border-gold/30'
                                      }`}
                                  >
                                      {t}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const handleOpenCancelModal = (resObj: any) => {
    setCancelModalReservation(resObj);
    setCancelReason('');
    setCancelAlternativeTermin('');
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
                setLoginError("Nesprávné heslo");
            }
        } else {
            console.error("API Error: Server nevrátil JSON. Status:", response.status);
            setLoginError("Chyba připojení k serveru (API není dostupné). Pokud jste na Coolify, ujistěte se, že typ nasazení je 'Node.js' (Nixpacks/Dockerfile), nikoliv 'Static Site', a startovací příkaz je 'npm run start'. Jinak se spustí jen frontend bez backendu!");
        }
    } catch (error) {
        console.error("Login error:", error);
        setLoginError("Chyba připojení k serveru (Síťová chyba nebo backend neběží).");
    } finally {
        setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
      try {
          const res = await fetch('/api/settings');
          const data = await res.json();
          setClientSectionEnabled(data.clientSectionEnabled || false);
          if (data.openingHours) setOpeningHours(data.openingHours);
      } catch (e) {
          console.error(e);
      }
  };

  const updateSetting = async (key: string, value: any) => {
      if (key === 'clientSectionEnabled') setClientSectionEnabled(value);
      try {
          await fetch('/api/admin/settings', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${adminToken}`
              },
              body: JSON.stringify({ [key]: value })
          });
      } catch (e) {
          console.error(e);
      }
  };

  const updateOpeningHours = (day: string, type: 'start' | 'end', val: string) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], [type]: val }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };

  const fetchData = async (token: string = adminToken) => {
    setIsLoading(true);
    try {
        const resResp = await fetch('/api/admin/reservations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resResp.ok) {
            const resData = await resResp.json();
            if (resData.success) {
                setReservations(resData.reservations);
            }
        }

        const vouchResp = await fetch('/api/admin/vouchers', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (vouchResp.ok) {
            const vouchData = await vouchResp.json();
            if (vouchData.success) {
                setVouchers(vouchData.vouchers || []);
            }
        }
    } catch (e) {
        console.error("Failed to fetch data", e);
    } finally {
        setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string, reason?: string, alternativeTermin?: string) => {
    const previousReservations = [...reservations];
    setReservations(reservations.map(res => res.id === id ? { ...res, status, cancelReason: reason, alternativeTermin } : res));

    try {
        const response = await fetch(`/api/admin/reservation/${id}/status`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status, reason, alternativeTermin })
        });
        
        if (!response.ok) throw new Error("Server error");
        alert(status === 'cancelled' 
            ? 'Rezervace byla úspěšně zrušena a klientovi byl odeslán e-mail.'
            : 'Stav byl úspěšně upraven a e-mail byl odeslán.');
        fetchData(adminToken);
    } catch (e) {
        alert("Chyba při ukládání stavu na server.");
        setReservations(previousReservations); 
    }
  };

  const updateVoucherStatus = async (id: number, status: string) => {
    const previousVouchers = [...vouchers];
    setVouchers(vouchers.map(v => v.id === id ? { ...v, status } : v));

    try {
        const response = await fetch(`/api/admin/voucher/${id}/status`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        
        if (status === 'paid') {
            alert(`Platba poukazu byla ověřena. Kód poukazu '${data.voucherCode}' byl úspěšně vygenerován a odeslán e-mailem.`);
        } else {
            alert(`Poukaz byl označen jako zrušený.`);
        }
        fetchData(adminToken);
    } catch (e) {
        alert("Chyba při ukládání stavu poukazu.");
        setVouchers(previousVouchers); 
    }
  };

  const confirmSendThankYouEmail = async () => {
    if (!thankYouModalReservation) return;
    setIsLoading(true);
    try {
        const response = await fetch(`/api/admin/reservation/${thankYouModalReservation.id}/thankyou`, {
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
                <button onClick={() => fetchData()} className="p-2 bg-[#0a2f1c] rounded-full hover:bg-gold hover:text-deep-green transition" title="Obnovit data">
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
                              {paginatedReservations.map(res => (
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
                                                  <button onClick={() => updateStatus(res.id, 'confirmed')} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Potvrdit termín (pošle instrukce)">Potvrdit (e-mail)</button>
                                                  <button onClick={() => handleOpenCancelModal(res)} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded shadow-sm transition" title="Zamítnout"><X size={16}/></button>
                                              </div>
                                          )}
                                          {res.status === 'confirmed' && (
                                              <div className="flex gap-2">
                                                  <button onClick={() => updateStatus(res.id, 'paid')} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Označit jako zaplaceno (pošle potvrzení)">Zaplaceno (e-mail)</button>
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
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Otevírací doba (Kalendář)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map((day) => (
                              <div key={day} className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex justify-between items-center">
                                  <span className="font-bold text-gray-300">{day}</span>
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                      <Clock size={14} />
                                      <input 
                                        type="text" 
                                        value={openingHours[day]?.start || ''} 
                                        onChange={(e) => updateOpeningHours(day, 'start', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" 
                                        placeholder="00:00"
                                      />
                                      <span>-</span>
                                      <input 
                                        type="text" 
                                        value={openingHours[day]?.end || ''} 
                                        onChange={(e) => updateOpeningHours(day, 'end', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" 
                                        placeholder="00:00"
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
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
                    <AdminCalendar 
                      selectedServiceId={cancelModalReservation.serviceId} 
                      onSelectDateTime={(d, t) => {
                          const dObj = new Date(d);
                          setCancelAlternativeTermin(`${dObj.getDate()}.${dObj.getMonth()+1}.${dObj.getFullYear()} v ${t}`);
                      }} 
                    />
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
                      updateStatus(cancelModalReservation.id, 'cancelled', cancelReason, cancelAlternativeTermin);
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

                <AdminCalendar 
                    selectedServiceId={rescheduleModalReservation.serviceId} 
                    onSelectDateTime={(d, t) => { setRescheduleDate(d); setRescheduleTime(t); }} 
                />

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