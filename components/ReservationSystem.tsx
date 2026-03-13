import React, { useState } from 'react';
import { SERVICES_LIST, API_BASE_URL } from '../constants';
import { ReservationStatus } from '../types';
import { Calendar, Clock, User, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
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
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
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

        // Kontrola, zda je odpověď JSON
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
      <div className="py-24 bg-beige-dark flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gold/30 p-10 rounded-lg shadow-2xl max-w-2xl text-center"
          >
            <div className="mx-auto w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-gold-dark" />
            </div>
            <h3 className="text-4xl text-gold-dark font-serif mb-4">Rezervace odeslána!</h3>
            <p className="text-text-dark text-lg mb-8">
                Děkuji, <b>{formData.name}</b>. Vaše žádost o termín <b>{new Date(selectedDate!).toLocaleDateString('cs-CZ')}</b> v <b>{selectedTime}</b> byla úspěšně přijata do systému.
                <br /><br />
                <span className="text-text-muted text-sm">Vyčkejte prosím na potvrzovací e-mail nebo SMS.</span>
            </p>
            <button 
                onClick={resetForm} 
                className="px-8 py-3 border border-gold text-gold-dark hover:bg-gold hover:text-white transition-all rounded uppercase tracking-wider font-bold"
            >
                Zpět na web
            </button>
          </motion.div>
      </div>
    );
  }

  return (
    <section id="reservation" className="py-24 bg-beige-dark relative border-t border-gold/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark uppercase tracking-widest text-sm">Online Objednávka</span>
          <h2 className="text-4xl md:text-5xl font-serif text-text-dark mt-2 mb-4">Rezervujte si svůj čas</h2>
          <p className="text-text-muted max-w-xl mx-auto">Vyberte si proceduru a termín, který vám nejvíce vyhovuje. Vše jednoduše online.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Progress / Steps Sidebar (Desktop) */}
            <div className="hidden lg:flex flex-col gap-8 w-1/4 pt-4 border-r border-gold/10 pr-8">
                <div className={`flex items-center gap-4 transition-colors duration-300 ${step >= 1 ? 'text-gold-dark' : 'text-text-muted/50'}`}>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors duration-300 ${step >= 1 ? 'border-gold bg-gold/10' : 'border-gold/20'}`}>1</div>
                    <span className="font-serif text-lg">Výběr služby</span>
                </div>
                <div className={`flex items-center gap-4 transition-colors duration-300 ${step >= 2 ? 'text-gold-dark' : 'text-text-muted/50'}`}>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors duration-300 ${step >= 2 ? 'border-gold bg-gold/10' : 'border-gold/20'}`}>2</div>
                    <span className="font-serif text-lg">Termín a čas</span>
                </div>
                <div className={`flex items-center gap-4 transition-colors duration-300 ${step >= 3 ? 'text-gold-dark' : 'text-text-muted/50'}`}>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors duration-300 ${step >= 3 ? 'border-gold bg-gold/10' : 'border-gold/20'}`}>3</div>
                    <span className="font-serif text-lg">Vaše údaje</span>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 bg-white p-6 md:p-8 rounded shadow-xl border border-gold/20 min-h-[500px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                {/* Step 1: Services */}
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-2xl text-text-dark font-serif mb-6 flex items-center gap-2">
                            <span className="text-gold-dark">01.</span> Zvolte proceduru
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {SERVICES_LIST.map((service) => (
                                <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                className="group flex justify-between items-center p-5 rounded border border-gold/20 hover:border-gold/50 hover:bg-beige-bg transition-all text-left"
                                >
                                    <div>
                                        <div className="text-xl text-text-dark font-serif group-hover:text-gold-dark transition">{service.title}</div>
                                        <div className="text-sm text-text-muted">{service.duration}</div>
                                    </div>
                                    <div className="text-gold-dark font-bold text-lg">{service.price}</div>
                                </button>
                            ))}
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
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl text-text-dark font-serif flex items-center gap-2">
                                <span className="text-gold-dark">02.</span> Vyberte termín
                            </h3>
                            <button onClick={() => setStep(1)} className="text-sm text-text-muted hover:text-gold-dark underline">Zpět na služby</button>
                        </div>
                        
                        <div className="mb-8">
                            <h4 className="text-text-muted text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Calendar size={14}/> Dostupné dny</h4>
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
                                        disabled={isWeekend} // Simple logic, real app would check availability API
                                        onClick={() => handleDateSelect(dateStr)}
                                        className={`flex-shrink-0 w-24 p-3 rounded text-center border transition-all ${
                                            isSelected 
                                                ? 'bg-gold border-gold text-white shadow-lg scale-105' 
                                                : isWeekend 
                                                    ? 'border-transparent text-text-muted/50 cursor-not-allowed bg-beige-bg'
                                                    : 'border-gold/30 bg-white text-text-dark hover:border-gold/50 hover:bg-beige-bg'
                                        }`}
                                    >
                                        <div className="text-xs uppercase font-bold mb-1">{day.toLocaleDateString('cs-CZ', { weekday: 'short' })}</div>
                                        <div className="text-xl font-serif">{day.getDate()}.{day.getMonth() + 1}.</div>
                                    </motion.button>
                                );
                                })}
                            </motion.div>
                        </div>

                        {selectedDate && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h4 className="text-text-muted text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={14}/> Dostupné časy</h4>
                                <motion.div 
                                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
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
                                    {timeSlots.map((time) => (
                                        <motion.button
                                            key={time}
                                            variants={{
                                                hidden: { opacity: 0, y: 10 },
                                                show: { opacity: 1, y: 0 }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleTimeSelect(time)}
                                            className="p-2 rounded border border-gold/30 hover:border-gold hover:bg-beige-bg text-text-dark transition-colors"
                                        >
                                            {time}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                     <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                     >
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-2xl text-text-dark font-serif flex items-center gap-2">
                                 <span className="text-gold-dark">03.</span> Kontaktní údaje
                             </h3>
                             <button onClick={() => setStep(2)} className="text-sm text-text-muted hover:text-gold-dark underline">Zpět na termín</button>
                         </div>
                        
                        <div className="bg-beige-bg p-4 rounded mb-6 flex gap-4 text-sm text-text-dark border-l-2 border-gold">
                            <div>
                                <span className="block text-text-muted text-xs uppercase">Služba</span>
                                <span className="text-text-dark font-bold">{SERVICES_LIST.find(s => s.id === selectedService)?.title}</span>
                            </div>
                            <div>
                                <span className="block text-text-muted text-xs uppercase">Termín</span>
                                <span className="text-text-dark font-bold">{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <User size={18} className="absolute top-3.5 left-3 text-text-muted" />
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Jméno a Příjmení"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-beige-bg border border-gold/30 p-3 pl-10 rounded text-text-dark focus:border-gold outline-none transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        required 
                                        placeholder="Telefon (+420...)"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-beige-bg border border-gold/30 p-3 rounded text-text-dark focus:border-gold outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <input 
                                type="email" 
                                required 
                                placeholder="E-mail pro potvrzení"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-beige-bg border border-gold/30 p-3 rounded text-text-dark focus:border-gold outline-none transition-colors"
                            />
                            <textarea 
                                placeholder="Máte nějaká zdravotní omezení nebo speciální přání?"
                                value={formData.note}
                                onChange={e => setFormData({...formData, note: e.target.value})}
                                className="w-full bg-beige-bg border border-gold/30 p-3 rounded text-text-dark focus:border-gold outline-none h-24 transition-colors"
                            ></textarea>

                            {errorMsg && (
                                <div className="bg-red-50 border border-red-200 p-3 rounded text-red-600 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {errorMsg}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full bg-gold text-white font-bold text-xl py-4 rounded hover:bg-gold-dark transition shadow-lg mt-4 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" /> Zpracovávám...
                                    </>
                                ) : 'Dokončit závaznou rezervaci'}
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