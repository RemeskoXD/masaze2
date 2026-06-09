import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, CreditCard, ChevronRight, CheckCircle, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { CONTACT_INFO, SERVICES_LIST } from '../constants';

const GiftVouchers: React.FC = () => {
  const [step, setStep] = useState(1);
  const [voucherType, setVoucherType] = useState<'service' | 'value'>('value');
  const [selectedValue, setSelectedValue] = useState<string>('2000');
  const [selectedService, setSelectedService] = useState<string>('');
  const [customValue, setCustomValue] = useState<string>('');
  
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    email: '',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const OPTIONS = [
    { value: '1000', label: '1 000 Kč' },
    { value: '2000', label: '2 000 Kč' },
    { value: '2500', label: '2 500 Kč' },
    { value: 'custom', label: 'Vlastní částka' }
  ];

  const handleNext = () => {
    if (voucherType === 'value' && selectedValue === 'custom' && (!customValue || parseInt(customValue) < 500)) {
        setErrorMsg('Minimální částka pro poukaz je 500 Kč.');
        return;
    }
    if (voucherType === 'service' && !selectedService) {
        setErrorMsg('Vyberte prosím službu.');
        return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Front-end validation
    if (!formData.recipientName || !formData.senderName || !formData.email) {
      setErrorMsg("Vyplňte prosím všechna povinná pole (Jméno obdarovaného, Vaše jméno, E-mail).");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setErrorMsg("Zadejte prosím platnou e-mailovou adresu.");
        setIsSubmitting(false);
        return;
    }

    try {
        const payload = {
            type: voucherType,
            value: selectedValue === 'custom' ? customValue : selectedValue,
            service: selectedService,
            recipientName: formData.recipientName,
            senderName: formData.senderName,
            email: formData.email,
            note: formData.note
        };

        const response = await fetch('/api/voucher', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Server vrátil neočekávanou odpověď");
        }

        const result = await response.json();

        if (result.success) {
            setStep(3);
        } else {
            console.error("API Error:", result);
            setErrorMsg(result.message || "Nepodařilo se odeslat objednávku.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg("Nepodařilo se spojit se serverem.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section id="vouchers" className="relative py-24 bg-white overflow-hidden scroll-mt-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold/50"></div>
            <span className="text-gold-dark uppercase tracking-[0.2em] text-xs font-semibold">Darujte relaxaci</span>
            <div className="h-px w-8 bg-gold/50"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-text-dark mb-6">Dárkové poukazy</h2>
          <p className="text-text-muted max-w-2xl mx-auto font-light text-lg">
            Hledáte ideální dárek pro své blízké? Věnujte jim čas pro sebe, klid a hlubokou regeneraci.
          </p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="bg-white/60 backdrop-blur-sm border border-gold/20 rounded-[2rem] p-6 sm:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.03)]"
        >
          <AnimatePresence mode="wait">
             {step === 1 && (
                 <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                 >
                     <h3 className="text-2xl font-serif text-text-dark mb-8 text-center">Vyberte typ poukazu</h3>
                     
                     <div className="flex bg-gold/5 p-1 rounded-xl w-fit mx-auto mb-10">
                         <button 
                             onClick={() => setVoucherType('value')}
                             className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${voucherType === 'value' ? 'bg-white shadow-sm text-gold-dark' : 'text-text-muted hover:text-text-dark'}`}
                         >
                             Na částku
                         </button>
                         <button 
                             onClick={() => setVoucherType('service')}
                             className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${voucherType === 'service' ? 'bg-white shadow-sm text-gold-dark' : 'text-text-muted hover:text-text-dark'}`}
                         >
                             Na konkrétní službu
                         </button>
                     </div>

                     {errorMsg && (
                         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3">
                             <AlertCircle size={18} className="mt-0.5 shrink-0" />
                             <p>{errorMsg}</p>
                         </div>
                     )}

                     {voucherType === 'value' ? (
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                             {OPTIONS.map(opt => (
                                 <button
                                     key={opt.value}
                                     onClick={() => setSelectedValue(opt.value)}
                                     className={`p-4 rounded-xl border text-center transition-all ${
                                         selectedValue === opt.value 
                                         ? 'border-gold bg-gold text-white shadow-md' 
                                         : 'border-gold/20 hover:border-gold/50 text-text-dark hover:bg-gold/5'
                                     }`}
                                 >
                                     <span className="font-medium">{opt.label}</span>
                                 </button>
                             ))}
                             {selectedValue === 'custom' && (
                                 <div className="col-span-2 md:col-span-4 mt-2">
                                     <label className="block text-sm text-text-muted mb-2 font-medium ml-1">Zadejte vlastní částku (Kč)</label>
                                     <input 
                                         type="number"
                                         min="500"
                                         value={customValue}
                                         onChange={(e) => setCustomValue(e.target.value)}
                                         placeholder="Např. 1500"
                                         className="w-full px-5 py-4 rounded-xl border border-gold/20 bg-white/50 focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                     />
                                 </div>
                             )}
                         </div>
                     ) : (
                         <div className="space-y-3 mb-8">
                             {SERVICES_LIST.map(service => (
                                 <button
                                     key={service.id}
                                     onClick={() => setSelectedService(service.title)}
                                     className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                                         selectedService === service.title 
                                         ? 'border-gold bg-gold/5 shadow-sm' 
                                         : 'border-gold/20 hover:border-gold/50 hover:bg-gold/5'
                                     }`}
                                 >
                                     <span className={`font-medium ${selectedService === service.title ? 'text-gold-dark' : 'text-text-dark'}`}>{service.title}</span>
                                     <span className="text-text-muted text-sm">{service.price}</span>
                                 </button>
                             ))}
                         </div>
                     )}

                     <div className="flex justify-end mt-8 pt-6 border-t border-gold/10">
                         <button 
                             onClick={handleNext}
                             className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                         >
                             Pokračovat <ChevronRight size={18} />
                         </button>
                     </div>
                 </motion.div>
             )}

             {step === 2 && (
                 <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                 >
                     <h3 className="text-2xl font-serif text-text-dark mb-8 text-center">Údaje a platba</h3>
                     
                     <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 mb-8 flex gap-4 items-center">
                         <Gift className="text-gold-dark shrink-0" size={32} />
                         <div>
                             <h4 className="font-medium text-text-dark">Shrnutí poukazu</h4>
                             <p className="text-text-muted text-sm">
                                 {voucherType === 'value' 
                                     ? `Poukaz v hodnotě: ${selectedValue === 'custom' ? customValue : OPTIONS.find(o => o.value === selectedValue)?.label}`
                                     : `Poukaz na službu: ${selectedService}`
                                 }
                             </p>
                         </div>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm text-text-muted mb-2 font-medium ml-1">Jméno obdarovaného (pro koho)</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.recipientName}
                                    onChange={e => setFormData({...formData, recipientName: e.target.value})}
                                    placeholder="Např. Jana Nováková"
                                    className="w-full px-5 py-4 rounded-xl border border-gold/20 bg-white/50 focus:bg-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-2 font-medium ml-1">Vaše jméno (od koho)</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.senderName}
                                    onChange={e => setFormData({...formData, senderName: e.target.value})}
                                    placeholder="Např. Petr"
                                    className="w-full px-5 py-4 rounded-xl border border-gold/20 bg-white/50 focus:bg-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                         </div>
                         <div>
                             <label className="block text-sm text-text-muted mb-2 font-medium ml-1">Váš e-mail (kam poukaz pošleme)</label>
                             <input 
                                 required
                                 type="email" 
                                 value={formData.email}
                                 onChange={e => setFormData({...formData, email: e.target.value})}
                                 placeholder="Váš e-mail pro zaslání poukazu a pokynů k platbě"
                                 className="w-full px-5 py-4 rounded-xl border border-gold/20 bg-white/50 focus:bg-white focus:border-gold outline-none transition-all"
                             />
                         </div>
                         <div>
                             <label className="block text-sm text-text-muted mb-2 font-medium ml-1">Vzkaz (volitelně)</label>
                             <textarea 
                                 rows={3}
                                 value={formData.note}
                                 onChange={e => setFormData({...formData, note: e.target.value})}
                                 placeholder="Krátký vzkaz, který se vytiskne na poukaz..."
                                 className="w-full px-5 py-4 rounded-xl border border-gold/20 bg-white/50 focus:bg-white focus:border-gold outline-none transition-all resize-none"
                             ></textarea>
                         </div>

                         {errorMsg && (
                             <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3">
                                 <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                 <p>{errorMsg}</p>
                             </div>
                         )}

                         <div className="flex justify-between items-center mt-8 pt-6 border-t border-gold/10">
                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-text-muted hover:text-gold-dark font-medium transition-colors"
                            >
                                Zpět
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gold hover:bg-gold-dark disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2 shadow-md"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                                Objednat s povinností platby
                            </button>
                         </div>
                     </form>
                 </motion.div>
             )}

             {step === 3 && (
                 <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                 >
                     <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <CheckCircle className="text-emerald-500" size={40} />
                     </div>
                     <h3 className="text-3xl font-serif text-text-dark mb-4">Objednávka přijata</h3>
                     <p className="text-text-muted mb-8 max-w-md mx-auto">
                        Děkujeme! Vaše žádost o dárkový poukaz byla odeslána. Na Váš e-mail <strong>{formData.email}</strong> jsme zaslali pokyny k platbě převodem.
                     </p>
                     <button 
                         onClick={() => {
                             setStep(1);
                             setFormData({ recipientName: '', senderName: '', email: '', note: '' });
                         }}
                         className="border border-gold text-gold-dark hover:bg-gold/5 px-8 py-3 rounded-full font-medium transition-all"
                     >
                         Vytvořit další poukaz
                     </button>
                 </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftVouchers;
