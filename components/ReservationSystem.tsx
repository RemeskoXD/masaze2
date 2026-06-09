import React, { useState, useEffect } from 'react';
import { SERVICES_LIST, API_BASE_URL } from '../constants';
import { ReservationStatus } from '../types';
import { Calendar, Clock, User, CheckCircle, Loader2, AlertCircle, Check, ArrowRight, ArrowLeft, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';


const ReservationSystem: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  });
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00' },
    'Úterý': { start: '09:00', end: '18:00' },
    'Středa': { start: '09:00', end: '18:00' },
    'Čtvrtek': { start: '09:00', end: '18:00' },
    'Pátek': { start: '09:00', end: '18:00' },
    'Sobota': { start: '09:00', end: '18:00' },
    'Neděle': { start: '09:00', end: '18:00' }
  });

  useEffect(() => {
     const fetchSettings = async () => {
         try {
             const res = await fetch('/api/settings');
             if (res.ok) {
                 const data = await res.json();
                 if (data.openingHours) setOpeningHours(data.openingHours);
             }
         } catch (e) {
             console.log(e);
         }
     };
     fetchSettings();
  }, []);

  const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = selectedDate) => {
    if (!serviceId) return [];
    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
  
    // Parse duration number (e.g. "60 min" -> 60)
    const durationMatch = service.duration.match(/(\d+)/);
    let duration = durationMatch ? parseInt(durationMatch[0]) : 60;
  
    // Add addon durations
    selectedAddons.forEach(addonId => {
        const addon = SERVICES_LIST.find(s => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\d+)/);
            if (m) duration += parseInt(m[0]);
        }
    });

    let dayOfWeek = 'Pondělí';
    if (dateStr) {
      const d = new Date(dateStr);
      dayOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][d.getDay()];
    }

    const daySettings = openingHours[dayOfWeek];
    if (!daySettings || !daySettings.start || !daySettings.end) return [];

    const startParts = daySettings.start.split(':');
    const endParts = daySettings.end.split(':');
    
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  
    // Gap between massages based on duration
    let gap = 0;
    if (duration <= 30) gap = 15;
    else if (duration === 60) gap = 30;
    else gap = 30; // 90 min and more
  
    const totalBlockMinutes = duration + gap;
    const slots = [];
    
    let currentMinutes = startMinutes;
    
    // Create blocks that fit in the window
    while (currentMinutes + duration <= endMinutes) {
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        currentMinutes += totalBlockMinutes;
    }
  
    return slots;
  };


  const handleServiceSelect = (id: number) => {
    setSelectedService(id);
    setTimeout(() => setStep(2), 300); // Slight delay for the animation to play
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setTimeout(() => setStep(3), 300);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    if (currentMonth.getMonth() > today.getMonth() || currentMonth.getFullYear() > today.getFullYear()) {
         setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  // Calendar Generation
  const generateCalendarDays = () => {
       const year = currentMonth.getFullYear();
       const month = currentMonth.getMonth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Basic frontend validation
    const phoneRegex = /^[+]?[0-9\s]{9,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        setErrorMsg("Zadejte prosím platné telefonní číslo.");
        setIsSubmitting(false);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setErrorMsg("Zadejte prosím platnou e-mailovou adresu.");
        setIsSubmitting(false);
        return;
    }

    const mainService = SERVICES_LIST.find(s => s.id === selectedService);
    let totalPriceMatch = mainService?.price.match(/\d+/);
    let totalPrice = totalPriceMatch ? parseInt(totalPriceMatch[0]) : 0;
    
    selectedAddons.forEach(id => {
      const addon = SERVICES_LIST.find(s => s.id === id);
      if (addon) {
        const match = addon.price.match(/\d+/);
        if (match) {
          totalPrice += parseInt(match[0]);
        }
      }
    });

    const parts = formData.name.trim().split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const surnameClean = surname.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '');

    const dateObj = new Date(selectedDate!);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const timeParts = selectedTime!.split(':');
    const vs = `${day}${month}${year}${timeParts[0]}${timeParts[1]}`;

    const sanitize = (str: string) => str.replace(/[<>]/g, '').trim();

    const addonTexts = selectedAddons.map(id => {
        const addon = SERVICES_LIST.find(s => s.id === id);
        return addon ? `${addon.title} (${addon.price}, ${addon.duration})` : null;
    }).filter(Boolean).join(', ');

    const finalNote = selectedAddons.length > 0 
        ? `${sanitize(formData.note)}\n\n--- Vybrané doplňky ---\n${addonTexts}`.trim()
        : sanitize(formData.note);

    const reservationData = {
        serviceId: selectedService,
        date: selectedDate,
        time: selectedTime,
        customerName: sanitize(formData.name),
        email: sanitize(formData.email),
        phone: sanitize(formData.phone),
        note: finalNote,
        totalPrice,
        surnameClean,
        vs
    };

    try {
        const response = await fetch('/api/reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Server vrátil neočekávanou odpověď");
        }

        const result = await response.json();

        if (result.success) {
            setSubmitted(true);
        } else {
            console.error("API Error:", result);
            setErrorMsg(result.message || "Nepodařilo se vytvořit rezervaci.");
        }

    } catch (error) {
        console.error("Connection error:", error);
        setErrorMsg("Nepodařilo se spojit se serverem.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedAddons([]);
    setFormData({ name: '', email: '', phone: '', note: '' });
    setErrorMsg(null);
  };

  if (submitted) {
    const mainService = SERVICES_LIST.find(s => s.id === selectedService);
    let totalPriceMatch = mainService?.price.match(/\d+/);
    let totalPrice = totalPriceMatch ? parseInt(totalPriceMatch[0]) : 0;
    
    selectedAddons.forEach(id => {
      const addon = SERVICES_LIST.find(s => s.id === id);
      if (addon) {
        const match = addon.price.match(/\d+/);
        if (match) {
          totalPrice += parseInt(match[0]);
        }
      }
    });

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

    const spaydString = `SPD*1.0*ACC:${getIban()}*AM:${totalPrice}.00*CC:CZK*X-VS:${vs}*MSG:Masaze ${surnameClean}`.toUpperCase();

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
            <h3 className="text-3xl md:text-4xl text-text-dark font-serif mb-4">Rezervace odeslána</h3>
            <p className="text-text-muted mb-8 font-light leading-relaxed max-w-lg mx-auto">
                Děkuji, <strong className="font-medium text-text-dark">{formData.name}</strong>. Vaše žádost o termín <br/>
                <strong className="font-medium text-text-dark">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime}</strong> byla úspěšně přijata.
                <br /><br />
                <span className="text-sm text-gold-dark uppercase tracking-widest font-medium">Vyčkejte prosím na potvrzení.<br/><span className="text-xs normal-case tracking-normal opacity-80">(Zkontrolujte si prosím i složku Hromadné nebo SPAM)</span></span>
            </p>
            
            <div className="bg-beige-bg/50 border border-gold/10 p-6 rounded-2xl mb-8 flex flex-col items-center">
                <h4 className="text-sm uppercase tracking-widest font-medium text-text-dark mb-4">Platba převodem</h4>
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <QRCodeSVG value={spaydString} size={160} level="M" />
                </div>
                <p className="text-2xl font-serif text-text-dark mb-1">{totalPrice} Kč</p>
                <p className="text-sm text-text-muted font-light mb-2">Číslo účtu: <strong className="font-medium text-text-dark">3190751019/3030</strong> (Air Bank)</p>
                <p className="text-sm text-text-muted font-light mb-2">Variabilní symbol: <strong className="font-medium text-text-dark">{vs}</strong></p>
                <p className="text-xs text-text-muted italic">Při platbě přes QR kód se údaje vyplní automaticky.</p>
            </div>

            <button 
                onClick={resetForm} 
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
          <p className="text-text-muted max-w-xl mx-auto font-light text-lg">Vyberte si proceduru a termín, který Vám nejvíce vyhovuje. Vše jednoduše a elegantně online.</p>
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
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="text-3xl text-text-dark font-serif">
                                Zvolte proceduru
                            </h3>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gold-dark font-medium bg-gold/5 px-3 py-1.5 rounded-full border border-gold/20">
                                <Gift size={14} /> Bonus překvapení ke každé rezervaci
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {SERVICES_LIST.filter(s => s.id !== 12 && s.id !== 13).map((service) => {
                                const isSelected = selectedService === service.id;
                                // Fake "original" price logic + 50 CZK
                                const numericPriceMatch = service.price.match(/\d+/);
                                const originalPrice = numericPriceMatch ? `${parseInt(numericPriceMatch[0]) + 50} Kč` : null;

                                return (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service.id)}
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
                            <button onClick={() => setStep(1)} className="text-sm text-text-muted hover:text-gold-dark flex items-center gap-1 transition-colors uppercase tracking-widest font-medium">
                                <ArrowLeft size={14} /> Zpět
                            </button>
                        </div>
                        
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-text-dark text-sm uppercase tracking-[0.15em] font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-gold" /> Kalendář
                                </h4>
                                <div className="flex items-center gap-4">
                                    <button onClick={prevMonth} className="p-1 hover:text-gold transition-colors text-text-muted">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="font-serif text-lg min-w-[120px] text-center text-text-dark">
                                        {currentMonth.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button onClick={nextMonth} className="p-1 hover:text-gold transition-colors text-text-muted">
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
                                    {generateCalendarDays().map((date, idx) => {
                                        if (!date) return <div key={`empty-${idx}`} className="p-2"></div>;
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = selectedDate === dateStr;
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        // Simple past check (allowing today)
                                        const todayStr = new Date().toISOString().split('T')[0];
                                        const isPast = dateStr < todayStr;
                                        const disabled = isWeekend || isPast;

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
                                    <motion.div 
                                        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: { staggerChildren: 0.05 }
                                            }
                                        }}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {generateTimeSlots(selectedService, selectedAddons).map((time) => {
                                            const isSelected = selectedTime === time;
                                            return (
                                            <motion.button
                                                key={time}
                                                variants={{
                                                    hidden: { opacity: 0, scale: 0.9 },
                                                    show: { opacity: 1, scale: 1 }
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`py-2 text-sm rounded-full border transition-all duration-300 font-medium ${
                                                    isSelected
                                                    ? 'bg-gold border-gold text-white shadow-md'
                                                    : 'border-gold/30 hover:border-gold text-text-dark hover:bg-gold/5'
                                                }`}
                                            >
                                                {time}
                                            </motion.button>
                                        )})}
                                    </motion.div>
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
                             <button onClick={() => setStep(2)} className="text-sm text-text-muted hover:text-gold-dark flex items-center gap-1 transition-colors uppercase tracking-widest font-medium">
                                 <ArrowLeft size={14} /> Zpět
                             </button>
                         </div>
                        
                        {/* Summary Card */}
                        <div className="bg-[#FAF7F5] border border-[#E8DCCB] p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm">
                            <div>
                                <span className="block text-text-muted text-xs uppercase tracking-widest mb-1">Vybraná služba</span>
                                <span className="text-text-dark font-serif text-xl">{SERVICES_LIST.find(s => s.id === selectedService)?.title}</span>
                            </div>
                            <div>
                                <span className="block text-text-muted text-xs uppercase tracking-widest mb-1">Termín</span>
                                <span className="text-text-dark font-serif text-xl">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime}</span>
                            </div>
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

                            {/* Doplnky Selection */}
                            <div className="pt-6 pb-2 border-t border-gold/10 mt-6">
                                <h4 className="text-sm uppercase tracking-[0.15em] font-medium text-text-dark mb-4">Máte zájem o doplňkovou péči? (volitelné)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SERVICES_LIST.filter(s => s.id === 12 || s.id === 13).map((addon) => {
                                        const isSelected = selectedAddons.includes(addon.id);
                                        return (
                                            <button
                                                type="button"
                                                key={addon.id}
                                                onClick={() => setSelectedAddons(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id])}
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
