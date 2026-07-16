import React, { useState, useEffect } from 'react';
import { SERVICES_LIST, API_BASE_URL } from '../constants';
import { ReservationStatus } from '../types';
import { Calendar, Clock, User, CheckCircle, Loader2, AlertCircle, Check, ArrowRight, ArrowLeft, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';


const getNumericPrice = (p?: string | number) => typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, '')) || 0 : (p as number) || 0;
function PublicTimelinePicker({ date, time, endTime, setTime, setEndTime, setDisplayEndTime, serviceId, selectedAddons, reservations, specificDates, openingHours }: any) {
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
            const srv = SERVICES_LIST.find((s: any) => s.id === r.serviceId);
            let dur = 60;
            if (srv && srv.duration) {
                const m = srv.duration.match(/(\d+)/);
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
        const parsed = parseInt(service.duration.replace(/\D/g, ''));
        if (!isNaN(parsed)) displayDuration = parsed;
    }
    selectedAddons.forEach((addonId: number) => {
        const addon = SERVICES_LIST.find((s: any) => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\d+)/);
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
                                className={`py-3 px-2 rounded-xl text-center font-mono text-sm transition-all duration-300 border ${
                                    isSelected 
                                    ? 'bg-gold border-gold text-white shadow-md transform scale-105' 
                                    : 'bg-white border-gold/30 text-text-dark hover:border-gold hover:bg-gold/5'
                                }`}
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
}

const ReservationSystem: React.FC = () => {
  const [step, setStep] = useState(1);
  const goToStep = (newStep: number) => { setStep(newStep); setTimeout(() => { const el = document.getElementById('reservation'); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({top: y, behavior: 'smooth'}); } }, 50); };
  const [selectedCategory, setSelectedCategory] = useState<string | 'vse'>('vse');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [displayEndTime, setDisplayEndTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
    website: '' // Honeypot field
  });
  
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  const validateVoucher = async () => {
      setVoucherError('');
      setVoucherSuccess('');
      if (!voucherCodeInput.trim()) return;
      try {
          const res = await fetch('/api/voucher/validate', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ code: voucherCodeInput.trim() })
          });
          const data = await res.json();
          if (data.success) {
              setAppliedVoucher(data.voucher);
              setVoucherSuccess('Poukaz úspěšně uplatněn');
          } else {
              setVoucherError(data.message);
              setAppliedVoucher(null);
          }
      } catch(e) {
          setVoucherError('Chyba při ověřování poukazu');
      }
  };

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [specificDates, setSpecificDates] = useState<any>({});
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Úterý': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Středa': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Čtvrtek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Pátek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Sobota': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });
  
  useEffect(() => {
    const handleSelectService = (e: any) => {
      const detail = e.detail;
      if (detail && detail.serviceId) {
        setSelectedService(detail.serviceId); setSelectedTime(null); setSelectedEndTime(null);
        goToStep(2);
      }
    };
    window.addEventListener('selectServiceEvent', handleSelectService);
    return () => {
      window.removeEventListener('selectServiceEvent', handleSelectService);
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.specificDates) {
            try {
              let parsed = data.specificDates;
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              setSpecificDates(parsed || {});
            } catch(e){}
          }
          if (data.openingHours) {
            try {
              let parsedOh = data.openingHours;
              if (typeof parsedOh === 'string') parsedOh = JSON.parse(parsedOh);
              if (typeof parsedOh === 'string') parsedOh = JSON.parse(parsedOh);
              if (parsedOh && typeof parsedOh === 'object') {
                 setOpeningHours(parsedOh);
              }
            } catch(e){}
          }
        }
      } catch (e) { console.log(e); }
    };
    fetchSettings();
    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/availability');
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data);
        }
      } catch (e) { console.log(e); }
    };
    fetchAvailability();
  }, []);

    const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = selectedDate) => {
    if (!serviceId || !dateStr) return [];
    
    const d = new Date(dateStr);
    const daysOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const dayName = daysOfWeek[d.getDay()];
    
    let settings = specificDates[dateStr];
    
    if (!settings || !settings.isOpen || !settings.start || !settings.end) return [];

    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
    
    const durationMatch = service.duration.match(/(\d+)/);
    let duration = durationMatch ? parseInt(durationMatch[0]) : 60;
    selectedAddons.forEach(addonId => {
        const addon = SERVICES_LIST.find(s => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\d+)/);
            if (m) duration += parseInt(m[0]);
        }
    });

    const startParts = settings.start.split(':');
    const endParts = settings.end.split(':');
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    let gap = 0;
    if (duration <= 30) gap = 15;
    else if (duration === 60) gap = 30;
    else gap = 30;
    const totalBlockMinutes = duration + gap;

    const breaks = (settings.breaks || []).map((br: any) => {
        const bs = br.start.split(':');
        const be = br.end.split(':');
        return {
            start: parseInt(bs[0]) * 60 + parseInt(bs[1]),
            end: parseInt(be[0]) * 60 + parseInt(be[1])
        };
    });

    // Combine settings breaks with existing reservations for this date
    bookedSlots.filter((b: any) => b.date === dateStr).forEach((b: any) => {
        let rsMins = 0;
        let reMins = 0;
        if (b.time) {
            const ts = b.time.split(':');
            rsMins = parseInt(ts[0]) * 60 + parseInt(ts[1]);
        }
        if (b.endTime) {
            const te = b.endTime.split(':');
            reMins = parseInt(te[0]) * 60 + parseInt(te[1]);
        } else if (b.serviceId && b.time) {
            // Fallback if no endTime is saved (old reservations)
            let bDuration = 60;
            const bService = SERVICES_LIST.find(s => s.id === b.serviceId);
            if (bService) {
                const bm = bService.duration.match(/(\d+)/);
                if (bm) bDuration = parseInt(bm[0]) + 15;
            }
            reMins = rsMins + bDuration;
        }
        
        if (rsMins > 0 && reMins > rsMins) {
            // Buffer time before and after reservation (let's say 0 mins buffer since the reservation already includes a 15 min buffer in endTime, or we can just use the exact start/end)
            breaks.push({
                start: rsMins,
                end: reMins
            });
        }
    });

    const slots = [];
    let currentMinutes = startMinutes;
    
    while (currentMinutes + duration <= endMinutes) {
        let isValid = true;
        let blockEnd = currentMinutes + duration;
        
        for (const br of breaks) {
            if (currentMinutes < br.end && blockEnd > br.start) {
                isValid = false;
                currentMinutes = Math.ceil(br.end / 15) * 15; // Jump to the end of the break, aligned to 15m
                break;
            }
        }
        
        if (isValid) {
            const h = Math.floor(currentMinutes / 60);
            const m = currentMinutes % 60;
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            currentMinutes += totalBlockMinutes;
        }
    }
    return slots;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTime === time) {
        goToStep(3);
    } else {
        setSelectedTime(time);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!termsAccepted) {
      setErrorMsg('Pro odeslání rezervace musíte souhlasit s obchodními podmínkami.');
      return;
    }
    
    if (!selectedDate || !selectedTime || !selectedService) {
      setErrorMsg('Vyberte prosím službu, datum a čas.');
      return;
    }
    setIsSubmitting(true);
    
    const parts = formData.name.trim().split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const surnameClean = surname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '');

    const dateObj = new Date(selectedDate!);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const timeParts = selectedTime!.split(':');
    const vs = `${day}${month}${year}${timeParts[0]}${timeParts[1]}`;

    const getIban = () => {
      const bank = "3030";
      const accNum = "3190751019";
      const bban = `${bank}${"0".repeat(6)}${accNum}`;
      const numericIban = `${bban}123500`;
      let remainder = 0;
      for (let i = 0; i < numericIban.length; i++) {
          remainder = (remainder * 10 + parseInt(numericIban[i], 10)) % 97;
      }
      const checkDigits = (98 - remainder).toString().padStart(2, '0');
      return `CZ${checkDigits}${bban}`;
    };

    const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);
    const servicePrice = selectedServiceData ? parseInt(selectedServiceData.price.replace(/[^\d]/g, '')) || 0 : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(id => {
        const a = SERVICES_LIST.find(s => s.id === id);
        if (a) addonsPrice += parseInt(a.price.replace(/[^\d]/g, '')) || 0;
    });
    const depositPrice = servicePrice + addonsPrice;
    const spaydString = `SPD*1.0*ACC:${getIban()}*AM:${depositPrice}.00*CC:CZK*X-VS:${vs}*MSG:Zaloha Masaze ${surnameClean}`.toUpperCase();

    try {
        const res = await fetch('/api/reservation', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serviceId: selectedService,
                date: selectedDate,
                time: selectedTime,
                endTime: selectedEndTime,
                customerName: formData.name,
                phone: formData.phone,
                email: formData.email,
                note: formData.note,
                totalPrice: depositPrice,
                surnameClean,
                vs,
                website: formData.website,
                appliedVoucherCode: appliedVoucher ? appliedVoucher.voucherCode : undefined
            })
        });
        const data = await res.json();
        if (data.success) {
            setSubmitted(true);
        } else {
            setErrorMsg(data.message || 'Něco se pokazilo, zkuste to prosím znovu.');
        }
    } catch(err) {
        setErrorMsg('Chyba spojení, zkuste to prosím znovu.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (submitted) {
    const parts = formData.name.trim().split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const surnameClean = surname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '');

    const dateObj = new Date(selectedDate!);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const timeParts = selectedTime!.split(':');
    const vs = `${day}${month}${year}${timeParts[0]}${timeParts[1]}`;

    const getIban = () => {
      const bank = "3030";
      const accNum = "3190751019";
      const bban = `${bank}${"0".repeat(6)}${accNum}`;
      const numericIban = `${bban}123500`;
      let remainder = 0;
      for (let i = 0; i < numericIban.length; i++) {
          remainder = (remainder * 10 + parseInt(numericIban[i], 10)) % 97;
      }
      const checkDigits = (98 - remainder).toString().padStart(2, '0');
      return `CZ${checkDigits}${bban}`;
    };

    const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);
    const servicePrice = selectedServiceData ? parseInt(selectedServiceData.price.replace(/[^\d]/g, '')) || 0 : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(id => {
        const a = SERVICES_LIST.find(s => s.id === id);
        if (a) addonsPrice += parseInt(a.price.replace(/[^\d]/g, '')) || 0;
    });
    const depositPrice = servicePrice + addonsPrice;
    const spaydString = `SPD*1.0*ACC:${getIban()}*AM:${depositPrice}.00*CC:CZK*X-VS:${vs}*MSG:Zaloha Masaze ${surnameClean}`.toUpperCase();


    return (
      <div className="py-32 bg-beige-bg flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white border border-gold/20 p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] w-full max-w-2xl text-center relative z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6"
            >
                <CheckCircle size={40} className="text-gold-dark" strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-3xl md:text-4xl text-text-dark font-serif mb-4">Rezervace přijata</h3>
            
            <p className="text-text-muted mb-8 font-light leading-relaxed max-w-xl mx-auto">
                Děkuji, <strong className="font-medium text-text-dark">{formData.name}</strong>. Vaše žádost o termín <strong className="font-medium text-text-dark">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime} - {displayEndTime}</strong> byla úspěšně přijata.
                <br /><br />
                <strong className="text-gold-dark text-lg font-medium">Pro potvrzení termínu je potřeba uhradit zálohu ve výši 100 %.</strong><br/>
                <span className="text-sm">Zálohu prosím uhrad'te <strong>nejpozději 24 hodin</strong> před domluveným termínem. Teprve po zaplacení zálohy je Váš termín platný.</span>
                <br /><br />
                <span className="text-sm text-text-muted opacity-80">(Potvrzení a tyto pokyny Vám za chvíli dorazí i na e-mail. Zkontrolujte si prosím i složku Hromadné nebo SPAM.)</span>
            </p>

            <div className="bg-white border border-gold/20 p-5 rounded-xl mb-8 text-left max-w-xl mx-auto shadow-sm">
                <p className="font-medium text-text-dark text-sm mb-1">Storno podmínky a zrušení termínu</p>
                <p className="text-sm text-text-muted font-light leading-relaxed">Pokud potřebujete termín zrušit nebo přesunout, dejte mi prosím vědět <strong>nejpozději 24 hodin předem</strong> – v takovém případě Vám zálohu v plné výši vrátím. Při pozdějším zrušení bohužel záloha propadá, pokud se spolu nedomluvíme jinak.</p>
            </div>
            
            <div className="bg-beige-bg/50 border border-gold/10 p-6 md:p-8 rounded-2xl mb-8 flex flex-col items-center text-left">
                <h4 className="text-sm uppercase tracking-widest font-medium text-text-dark mb-6 text-center w-full">Jak zálohu zaplatit?</h4>
                <div className="w-full max-w-sm mb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">1</div>
                    <p className="text-sm text-text-muted">Otevřete si v mobilu aplikaci Vaší banky (tzv. mobilní bankovnictví).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">2</div>
                    <p className="text-sm text-text-muted">Zvolte možnost <strong>"Platba QR kódem"</strong> (často ikonka fotoaparátu).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">3</div>
                    <p className="text-sm text-text-muted">Namiřte fotoaparát na tento černobílý čtverec a údaje se samy vyplní. Pak jen platbu potvrďte.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-center">
                    <QRCodeSVG value={spaydString} size={180} level="M" />
                </div>
                
                <div className="w-full text-center">
                  <p className="text-3xl font-serif text-text-dark mb-4 text-center">Záloha: {depositPrice} Kč</p>
                  <div className="w-full h-px bg-gold/20 my-5"></div>
                  <p className="text-sm text-text-muted font-medium mb-3 text-center">Nebo můžete zadat údaje ručně:</p>
                  <p className="text-sm text-text-muted font-light mb-2 text-center">Číslo účtu: <strong className="font-medium text-text-dark">3190751019/3030</strong> (Air Bank)</p>
                  <p className="text-sm text-text-muted font-light mb-2 text-center">Variabilní symbol: <strong className="font-medium text-text-dark">{vs}</strong></p>
                  <p className="text-sm text-text-muted font-light mb-2 text-center">Částka k úhradě: <strong className="font-medium text-text-dark">{depositPrice} Kč</strong></p>
                </div>
            </div>

            <button 
                onClick={() => { setSelectedService(null); setSelectedAddons([]); setSelectedDate(null); setSelectedTime(null); goToStep(1); }} 
                className="px-10 py-4 bg-transparent border border-gold/50 text-gold-dark hover:bg-gold hover:text-white hover:border-gold transition-all duration-500 rounded-full uppercase tracking-[0.2em] font-medium text-sm w-full sm:w-auto"
            >
                Zpět na úvod
            </button>
          </motion.div>
      </div>
    );
  }

  return (
    <section id="reservation" className="py-24 bg-beige-bg relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold/50"></div>
            <span className="text-gold-dark uppercase tracking-[0.2em] text-xs font-semibold">Online Objednávka</span>
            <div className="h-px w-8 bg-gold/50"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-dark mb-6">Rezervujte si svůj čas</h2>
          <p className="text-text-muted max-w-xl mx-auto font-light text-lg mb-3">Vyberte si proceduru a termín, který Vám nejvíce vyhovuje. Vše jednoduše a elegantně online.</p>
          <div className="inline-block bg-gold/10 text-gold-dark px-4 py-2 rounded-full text-sm font-medium tracking-wide">
            Otevírací doba po domluvě
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Progress / Steps Sidebar (Desktop) */}
            <div className="hidden lg:flex flex-col w-1/4 pt-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[1.15rem] top-12 bottom-12 w-px bg-gold/20 z-0"></div>
                
                <div className="flex flex-col gap-12 relative z-10">
                  <div className={`flex items-center gap-6 transition-all duration-500 ${step >= 1 ? 'text-text-dark' : 'text-text-muted/40'}`}>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-sans text-sm transition-all duration-500 bg-beige-bg ${step === 1 ? 'border-gold text-gold-dark shadow-[0_0_15px_rgba(197,168,128,0.3)]' : step > 1 ? 'border-gold bg-gold text-white' : 'border-gold/30'}`}>
                        {step > 1 ? <Check size={16} /> : '01'}
                      </div>
                      <span className={`font-serif text-xl ${step === 1 ? 'text-gold-dark' : ''}`}>Výběr služby</span>
                  </div>
                  <div className={`flex items-center gap-6 transition-all duration-500 ${step >= 2 ? 'text-text-dark' : 'text-text-muted/40'}`}>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-sans text-sm transition-all duration-500 bg-beige-bg ${step === 2 ? 'border-gold text-gold-dark shadow-[0_0_15px_rgba(197,168,128,0.3)]' : step > 2 ? 'border-gold bg-gold text-white' : 'border-gold/30'}`}>
                        {step > 2 ? <Check size={16} /> : '02'}
                      </div>
                      <span className={`font-serif text-xl ${step === 2 ? 'text-gold-dark' : ''}`}>Termín a čas</span>
                  </div>
                  <div className={`flex items-center gap-6 transition-all duration-500 ${step >= 3 ? 'text-text-dark' : 'text-text-muted/40'}`}>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-sans text-sm transition-all duration-500 bg-beige-bg ${step === 3 ? 'border-gold text-gold-dark shadow-[0_0_15px_rgba(197,168,128,0.3)]' : 'border-gold/30'}`}>
                        03
                      </div>
                      <span className={`font-serif text-xl ${step === 3 ? 'text-gold-dark' : ''}`}>Vaše údaje</span>
                  </div>
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="lg:hidden flex justify-between items-center mb-8 px-4 relative">
               <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-px bg-gold/20 z-0"></div>
               {[1, 2, 3].map((num) => (
                 <div key={num} className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center text-xs bg-beige-bg transition-colors ${step === num ? 'border-gold text-gold-dark shadow-md' : step > num ? 'border-gold bg-gold text-white' : 'border-gold/30 text-text-muted/40'}`}>
                   {step > num ? <Check size={12} /> : `0${num}`}
                 </div>
               ))}
            </div>

            {/* Main Form Area */}
            <div className="flex-1 bg-white p-6 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gold/10 min-h-[500px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                {/* Step 1: Services */}
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-3xl text-text-dark font-serif">
                                Zvolte proceduru
                            </h3>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gold-dark font-medium bg-gold/5 px-3 py-1.5 rounded-full border border-gold/20">
                                <Gift size={14} /> Bonus překvapení ke každé rezervaci
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {[
                                { id: 'vse', name: 'Vše' },
                                { id: 'uvolneni', name: 'Uvolnění a regenerace' },
                                { id: 'krasa', name: 'Krása a péče' },
                                { id: 'jemna', name: 'Jemná péče' },
                                { id: 'specialni', name: 'Zvýhodněné balíčky' }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 border ${
                                        selectedCategory === cat.id
                                        ? 'bg-gold text-white border-gold shadow-md'
                                        : 'bg-white text-text-muted border-gold/20 hover:border-gold/60 hover:text-gold-dark'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {SERVICES_LIST.filter(s => s.id !== 12 && s.id !== 13 && (selectedCategory === 'vse' || s.category === selectedCategory)).map((service) => {
                                const isSelected = selectedService === service.id;
                                // Fake "original" price logic + 50 CZK
                                const numericPriceMatch = service.price.match(/\d+/);
                                const originalPrice = numericPriceMatch ? `${parseInt(numericPriceMatch[0]) + 50} Kč` : null;

                                return (
                                <button
                                    key={service.id}
                                    onClick={() => { if (selectedService === service.id) goToStep(2); else { setSelectedService(service.id); } }}
                                    className={`group relative flex justify-between items-center p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                                        isSelected 
                                        ? 'border-gold bg-gold/5 shadow-md' 
                                        : 'border-gold/20 hover:border-gold/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                                    }`}
                                >
                                    <div className="relative z-10 w-2/3">
                                        <div className={`text-xl font-serif transition-colors duration-300 ${isSelected ? 'text-gold-dark' : 'text-text-dark group-hover:text-gold-dark'}`}>{service.title}</div>
                                        <div className="text-sm text-text-muted font-light mt-1 flex items-center gap-2">
                                            <Clock size={12} className={isSelected ? 'text-gold' : 'text-gold/60'} /> {service.duration}
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex flex-col items-end gap-1">
                                        {originalPrice && (
                                            <span className="text-xs text-text-muted/60 line-through font-mono">
                                                {originalPrice}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <span className={`font-medium text-lg ${isSelected ? 'text-gold-dark' : 'text-text-dark'}`}>{service.price}</span>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-gold bg-gold text-white' : 'border-gold/30 text-transparent group-hover:border-gold/60'}`}>
                                                <Check size={12} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Hover background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                </button>
                            )})}
                        </div>
                        <AnimatePresence>
                            {selectedService && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: 10, height: 0 }}
                                    className="mt-8 flex justify-end overflow-hidden"
                                >
                                    <button
                                        onClick={() => goToStep(2)}
                                        className="px-8 py-3 bg-gold text-white rounded-full font-medium tracking-wide hover:bg-gold-dark transition-colors shadow-md flex items-center gap-2"
                                    >
                                        Pokračovat k výběru termínu
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl text-text-dark font-serif">
                                Vyberte termín
                            </h3>
                            <span className="block text-sm text-gold-dark font-medium italic">Otevírací doba po domluvě.</span>
                            <button onClick={() => goToStep(1)} className="text-sm text-text-muted hover:text-gold-dark flex items-center gap-1 transition-colors uppercase tracking-widest font-medium">
                                <ArrowLeft size={14} /> Zpět
                            </button>
                        </div>
                        
                        {/* Doplnky Selection */}
                            <div className="mb-10">
                                <h4 className="text-sm uppercase tracking-[0.15em] font-medium text-text-dark mb-4">Máte zájem o doplňkovou péči? (volitelné)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SERVICES_LIST.filter(s => s.id === 12 || s.id === 13).map((addon) => {
                                        const isSelected = selectedAddons.includes(addon.id);
                                        return (
                                            <button
                                                type="button"
                                                key={addon.id}
                                                onClick={() => { setSelectedAddons(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id]); }}
                                                className={`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                                                    isSelected 
                                                    ? 'border-gold bg-gold/5 shadow-sm' 
                                                    : 'border-gold/20 hover:border-gold/50 bg-transparent'
                                                }`}
                                            >
                                                <div className={`mt-1 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-gold border-gold text-white' : 'border-gold/40 text-transparent group-hover:border-gold/70'}`}>
                                                    <Check size={14} />
                                                </div>
                                                <div>
                                                    <div className={`font-serif text-lg mb-1 leading-tight ${isSelected ? 'text-gold-dark' : 'text-text-dark group-hover:text-gold-dark'}`}>
                                                        {addon.title.replace(' (Doplňková služba)', '')}
                                                    </div>
                                                    <div className="text-sm font-medium text-text-dark mb-2">{addon.price} <span className="text-text-muted font-light">/ {addon.duration}</span></div>
                                                    <div className="text-xs text-text-muted font-light leading-relaxed">{addon.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-text-dark text-sm uppercase tracking-[0.15em] font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-gold" /> Kalendář
                                </h4>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:text-gold transition-colors text-text-muted">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="font-serif text-lg min-w-[120px] text-center text-text-dark">
                                        {currentMonth.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:text-gold transition-colors text-text-muted">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <motion.div 
                                className="border border-gold/20 rounded-2xl p-4 bg-white/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-text-muted/60 mb-2 font-medium">
                                    {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => <div key={d} className="py-2">{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {(() => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const firstDay = d.getDay();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Start on Monday
    const days = [];
    for (let i = 0; i < startingDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(d.getFullYear(), d.getMonth(), i));
    }
    return days;
})().map((date, idx) => {
                                        if (!date) return <div key={`empty-${idx}`} className="p-2"></div>;
                                        const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                                        const isSelected = selectedDate === dateStr;
                                        const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
const isPast = dateStr < todayStr;
const hasSlots = generateTimeSlots(selectedService, selectedAddons, dateStr).length > 0;
const disabled = isPast || !hasSlots;

                                        return (
                                            <button
                                                key={dateStr}
                                                disabled={disabled}
                                                onClick={() => handleDateSelect(dateStr)}
                                                className={`p-3 text-center rounded-xl font-serif text-lg transition-all duration-300 ${
                                                    isSelected
                                                    ? 'bg-gold text-white shadow-md'
                                                    : disabled
                                                        ? 'text-text-muted/30 cursor-not-allowed'
                                                        : 'hover:bg-gold/10 text-text-dark'
                                                }`}
                                            >
                                                {date.getDate()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {selectedDate && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, y: 10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="overflow-hidden"
                                >
                                    <h4 className="text-text-dark text-sm uppercase tracking-[0.15em] font-medium mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-gold" /> Dostupné časy
                                    </h4>
                                    <div className="mt-2">
                                        <PublicTimelinePicker
                                            date={selectedDate}
                                            time={selectedTime}
                                            endTime={displayEndTime}
                                            setTime={setSelectedTime}
                                            setEndTime={setSelectedEndTime}
                                            serviceId={selectedService}
                                            selectedAddons={selectedAddons}
                                            reservations={bookedSlots}
                                            specificDates={specificDates}
                                            openingHours={openingHours}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {selectedTime && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: 10, height: 0 }}
                                                className="mt-8 flex justify-end overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => goToStep(3)}
                                                    className="px-8 py-3 bg-gold text-white rounded-full font-medium tracking-wide hover:bg-gold-dark transition-colors shadow-md flex items-center gap-2"
                                                >
                                                    Pokračovat k údajům
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                     <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                     >
                        <div className="flex justify-between items-center mb-8">
                             <h3 className="text-3xl text-text-dark font-serif">
                                 Kontaktní údaje
                             </h3>
                             <button onClick={() => goToStep(2)} className="text-sm text-text-muted hover:text-gold-dark flex items-center gap-1 transition-colors uppercase tracking-widest font-medium">
                                 <ArrowLeft size={14} /> Zpět
                             </button>
                         </div>
                        

                        {/* Summary Card */}
                        <div className="bg-[#FAF7F5] border border-[#E8DCCB] p-6 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-12 text-sm">
                            <div className="flex gap-6 sm:gap-12">
                                <div>
                                    <span className="block text-text-muted text-xs uppercase tracking-widest mb-1">Vybraná služba</span>
                                    <span className="text-text-dark font-serif text-xl">{SERVICES_LIST.find(s => s.id === selectedService)?.title}</span>
                                </div>
                                <div>
                                    <span className="block text-text-muted text-xs uppercase tracking-widest mb-1">Termín</span>
                                    <span className="text-text-dark font-serif text-xl">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime} - {displayEndTime}</span>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <span className="block text-text-muted text-xs uppercase tracking-widest mb-1">Celková cena</span>
                                <span className="text-gold font-serif text-2xl font-bold">
                                    {(() => {
                                        const service = SERVICES_LIST.find(s => s.id === selectedService);
                                        let price = getNumericPrice(service?.price);
                                        price += selectedAddons.reduce((acc, a) => acc + getNumericPrice(SERVICES_LIST.find(x => x.id === a)?.price), 0);
                                        
                                        if (appliedVoucher) {
                                            if (appliedVoucher.type === 'value') {
                                                price = Math.max(0, price - appliedVoucher.value);
                                            } else if (appliedVoucher.type === 'service') {
                                                price = 0;
                                            }
                                        }
                                        return price + ' Kč';
                                    })()}
                                </span>
                            </div>
                        </div>
                        
                        <div className="mb-8 p-6 bg-white border border-[#E8DCCB] rounded-2xl shadow-sm">
                            <h4 className="text-sm font-medium text-text-dark uppercase tracking-widest mb-4">Máte dárkový poukaz?</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Zadejte kód poukazu (např. TR-123456)" 
                                    value={voucherCodeInput}
                                    onChange={e => setVoucherCodeInput(e.target.value)}
                                    className="flex-1 bg-transparent border-b border-gold/30 py-2 text-text-dark focus:border-gold outline-none transition-colors"
                                    disabled={!!appliedVoucher}
                                />
                                {!appliedVoucher ? (
                                    <button 
                                        type="button" 
                                        onClick={validateVoucher}
                                        className="bg-gold/10 text-gold hover:bg-gold hover:text-white px-6 py-2 rounded transition-colors font-medium text-sm"
                                    >
                                        Ověřit kód
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => { setAppliedVoucher(null); setVoucherCodeInput(''); setVoucherSuccess(''); }}
                                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded transition-colors font-medium text-sm"
                                    >
                                        Zrušit poukaz
                                    </button>
                                )}
                            </div>
                            {voucherError && <p className="text-red-500 text-xs mt-2">{voucherError}</p>}
                            {voucherSuccess && <p className="text-green-600 text-xs mt-2">{voucherSuccess}</p>}
                            {appliedVoucher && appliedVoucher.type === 'value' && (
                                <p className="text-text-muted text-xs mt-2 italic">Z hodnoty poukazu bude odečtena příslušná částka. Zbylá hodnota zůstane na poukazu pro další použití.</p>
                            )}
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        required 
                                        id="name"
                                        placeholder=" "
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="block w-full bg-transparent border-b border-gold/30 py-3 text-text-dark focus:border-gold outline-none transition-colors peer font-light"
                                    />
                                    <label htmlFor="name" className="absolute left-0 top-3 text-text-muted/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gold cursor-text">
                                        Jméno a Příjmení
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="tel" 
                                        required 
                                        id="phone"
                                        placeholder=" "
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="block w-full bg-transparent border-b border-gold/30 py-3 text-text-dark focus:border-gold outline-none transition-colors peer font-light"
                                    />
                                    <label htmlFor="phone" className="absolute left-0 top-3 text-text-muted/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gold cursor-text">
                                        Telefonní číslo
                                    </label>
                                </div>
                            </div>
                            
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    required 
                                    id="email"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="block w-full bg-transparent border-b border-gold/30 py-3 text-text-dark focus:border-gold outline-none transition-colors peer font-light"
                                />
                                <label htmlFor="email" className="absolute left-0 top-3 text-text-muted/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gold cursor-text">
                                    E-mailová adresa
                                </label>
                            </div>

                            {/* Honeypot field (hidden from real users) */}
                            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                                <label htmlFor="website">Website</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={e => setFormData({...formData, website: e.target.value})}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="relative group pt-2">
                                <textarea 
                                    id="note"
                                    placeholder=" "
                                    value={formData.note}
                                    onChange={e => setFormData({...formData, note: e.target.value})}
                                    className="block w-full bg-transparent border-b border-gold/30 py-3 text-text-dark focus:border-gold outline-none transition-colors peer font-light h-24 resize-none"
                                ></textarea>
                                <label htmlFor="note" className="absolute left-0 top-5 text-text-muted/70 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gold peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gold cursor-text">
                                    Zdravotní omezení nebo speciální přání (volitelné)
                                </label>
                            </div>


                            
                            <div className="flex items-start gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setTermsAccepted(!termsAccepted)}
                                    className={`mt-1 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-gold border-gold text-white' : 'border-gold/40 text-transparent hover:border-gold/70'}`}
                                >
                                    <Check size={14} />
                                </button>
                                <label className="text-sm text-text-muted cursor-pointer font-light leading-relaxed select-none" onClick={() => setTermsAccepted(!termsAccepted)}>
                                    Souhlasím s <a href="/obchodni-podminky" target="_blank" className="text-gold hover:underline" onClick={(e) => e.stopPropagation()}>obchodními podmínkami</a>, podmínkami storna a zpracováním osobních údajů.
                                </label>
                            </div>

                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 flex items-center gap-3 text-sm"
                                >
                                    <AlertCircle size={18} />
                                    {errorMsg}
                                </motion.div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`group relative w-full overflow-hidden rounded-full mt-8 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                <div className="absolute inset-0 w-full h-full bg-gold transition-all duration-500 ease-out"></div>
                                <div className="absolute inset-0 w-full h-full bg-gold-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
                                <div className="relative flex items-center justify-center gap-3 py-4 text-white font-medium uppercase tracking-[0.2em] text-sm">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> Zpracovávám...
                                        </>
                                    ) : (
                                        <>
                                            Dokončit rezervaci <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                            <p className="text-[11px] text-text-muted/60 text-center mt-4 font-light leading-relaxed">
                                Odesláním rezervace berete na vědomí, že Vaše osobní údaje (jméno, e-mail, telefon) budou zpracovány v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) za účelem správy a potvrzení Vaší rezervace.
                            </p>
                        </form>
                     </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSystem;
