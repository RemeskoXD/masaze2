import React, { useState } from 'react';
import { SERVICES_LIST, API_BASE_URL } from '../constants';
import { ReservationStatus } from '../types';
import { Calendar, Clock, User, CheckCircle, Loader2, AlertCircle, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getNextDays = (days: number) => {
  const result = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push(d);
  }
  return result;
};

// V budoucnu: Načítat obsazené časy z API
const timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const days = getNextDays(14); 

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const reservationData = {
        action: 'create_reservation',
        serviceId: selectedService,
        date: selectedDate,
        time: selectedTime,
        ...formData
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Server vrátil neočekávanou odpověď (ne JSON). Zkontrolujte api.php.");
        }

        const result = await response.json();

        if (result.success) {
            setSubmitted(true);
        } else {
            console.error("API Error:", result);
            setErrorMsg(result.message || "Nepodařilo se vytvořit rezervaci. Zkuste to prosím znovu.");
        }

    } catch (error) {
        console.error("Connection error:", error);
        setErrorMsg("Nepodařilo se spojit se serverem. Zkontrolujte připojení k internetu.");
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
    setFormData({ name: '', email: '', phone: '', note: '' });
    setErrorMsg(null);
  };

  if (submitted) {
    return (
      <div className="py-32 bg-beige-bg flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white border border-gold/20 p-12 md:p-16 rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] max-w-2xl text-center relative z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-8"
            >
                <CheckCircle size={48} className="text-gold-dark" strokeWidth={1.5} />
            </motion.div>
            <h3 className="text-4xl md:text-5xl text-text-dark font-serif mb-6">Rezervace odeslána</h3>
            <p className="text-text-muted text-lg mb-10 font-light leading-relaxed">
                Děkuji, <strong className="font-medium text-text-dark">{formData.name}</strong>. Vaše žádost o termín <br/>
                <strong className="font-medium text-text-dark">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime}</strong> byla úspěšně přijata.
                <br /><br />
                <span className="text-sm text-gold-dark uppercase tracking-widest font-medium">Vyčkejte prosím na potvrzení.</span>
            </p>
            <button 
                onClick={resetForm} 
                className="px-10 py-4 bg-transparent border border-gold/50 text-gold-dark hover:bg-gold hover:text-white hover:border-gold transition-all duration-500 rounded-full uppercase tracking-[0.2em] font-medium text-sm"
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
          <p className="text-text-muted max-w-xl mx-auto font-light text-lg">Vyberte si proceduru a termín, který vám nejvíce vyhovuje. Vše jednoduše a elegantně online.</p>
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
                        <h3 className="text-3xl text-text-dark font-serif mb-8">
                            Zvolte proceduru
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {SERVICES_LIST.map((service) => {
                                const isSelected = selectedService === service.id;
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
                                    <div className="relative z-10">
                                        <div className={`text-xl font-serif transition-colors duration-300 ${isSelected ? 'text-gold-dark' : 'text-text-dark group-hover:text-gold-dark'}`}>{service.title}</div>
                                        <div className="text-sm text-text-muted font-light mt-1 flex items-center gap-2">
                                            <Clock size={12} className={isSelected ? 'text-gold' : 'text-gold/60'} /> {service.duration}
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <span className={`font-medium text-lg ${isSelected ? 'text-gold-dark' : 'text-text-dark'}`}>{service.price}</span>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-gold bg-gold text-white' : 'border-gold/30 text-transparent group-hover:border-gold/60'}`}>
                                            <Check size={12} />
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
                            <h4 className="text-text-dark text-sm uppercase tracking-[0.15em] font-medium mb-4 flex items-center gap-2">
                                <Calendar size={16} className="text-gold" /> Dostupné dny
                            </h4>
                            <motion.div 
                                className="flex overflow-x-auto pb-4 gap-3 scrollbar-thin"
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
                                {days.map((day) => {
                                const dateStr = day.toISOString().split('T')[0];
                                const isSelected = selectedDate === dateStr;
                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                return (
                                    <motion.button
                                        key={dateStr}
                                        variants={{
                                            hidden: { opacity: 0, x: 20 },
                                            show: { opacity: 1, x: 0 }
                                        }}
                                        whileHover={!isWeekend ? { y: -2 } : {}}
                                        whileTap={!isWeekend ? { scale: 0.95 } : {}}
                                        disabled={isWeekend}
                                        onClick={() => handleDateSelect(dateStr)}
                                        className={`flex-shrink-0 w-24 p-4 rounded-2xl text-center border transition-all duration-300 ${
                                            isSelected 
                                                ? 'bg-gold border-gold text-white shadow-[0_10px_20px_rgba(197,168,128,0.3)]' 
                                                : isWeekend 
                                                    ? 'border-transparent text-text-muted/30 cursor-not-allowed bg-gray-50'
                                                    : 'border-gold/20 bg-white text-text-dark hover:border-gold/60 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`text-xs uppercase tracking-widest font-medium mb-2 ${isSelected ? 'text-white/90' : 'text-text-muted'}`}>
                                            {day.toLocaleDateString('cs-CZ', { weekday: 'short' })}
                                        </div>
                                        <div className="text-2xl font-serif leading-none">
                                            {day.getDate()}.{day.getMonth() + 1}.
                                        </div>
                                    </motion.button>
                                );
                                })}
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
                                        className="grid grid-cols-3 sm:grid-cols-4 gap-4"
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
                                        {timeSlots.map((time) => {
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
                                                className={`py-3 rounded-full border transition-all duration-300 font-medium ${
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
