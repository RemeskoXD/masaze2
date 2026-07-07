import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#terms') {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const close = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-beige-bg w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gold/20 relative"
          >
            <div className="flex justify-between items-center p-6 border-b border-gold/10">
              <h2 className="text-3xl font-serif text-gold-dark">Obchodní podmínky</h2>
              <button onClick={close} className="p-2 bg-gold/10 text-gold-dark hover:bg-gold hover:text-white rounded-full transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-text-dark font-light text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">1. Úvodní ustanovení</h3>
                <p>Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi poskytovatelem masérských a regeneračních služeb (dále jen "Poskytovatel") a klientem (dále jen "Klient").</p>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">2. Rezervace termínu a platba</h3>
                <p>Termín masáže si Klient rezervuje online prostřednictvím rezervačního formuláře. Po rezervaci obdrží Klient informace k platbě zálohy (obvykle 100 % částky, není-li sjednáno jinak). Rezervace může po odeslání padnout do složky SPAM v e-mailu klienta, proto doporučujeme tuto složku kontrolovat.</p>
                <p className="mt-2">Rezervace je platná a závazná až po připsání platby (zálohy) na účet Poskytovatele.</p>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">3. Zrušení a přesunutí termínu (Storno podmínky)</h3>
                <p>Chápeme, že do vašich plánů může něco nečekaně vstoupit. Pro bezproblémový chod služeb platí následující storno podmínky:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Změna nebo zrušení termínu je možné pouze telefonicky.</strong></li>
                  <li>Pokud Klient termín zruší <strong>více než 24 hodin</strong> před plánovaným začátkem, záloha mu bude vrácena v plné výši, nebo si může zvolit jiný termín.</li>
                  <li>Pokud Klient termín zruší <strong>méně než 24 hodin</strong> před plánovaným začátkem, záloha propadá (100% storno poplatek), <strong>pokud se s majitelkou výslovně nedomluví jinak</strong>.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">4. Vyšší moc a zrušení termínu ze strany poskytovatele</h3>
                <p>Poskytovatel se nezavazuje dodržet rezervovaný termín v případě zásahu vyšší moci (např. náhlé onemocnění, výpadek energií, havárie v provozovně nebo jiné neočekávané překážky). V takovém případě bude Klient neprodleně informován a bude mu nabídnut náhradní termín, případně vrácena záloha v plné výši.</p>
              </section>

              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">5. Odpovědnost a zdravotní stav</h3>
                <p>Klient je povinen před začátkem procedury informovat Poskytovatele o svém aktuálním zdravotním stavu a případných kontraindikacích. Poskytovatel nenese odpovědnost za případné zdravotní komplikace vzniklé v důsledku zamlčení těchto informací.</p>
              </section>
            </div>
            
            <div className="p-6 border-t border-gold/10 bg-white flex justify-end">
              <button onClick={close} className="px-8 py-3 bg-gold text-white hover:bg-gold-dark rounded-full font-semibold transition-colors">
                Zavřít
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TermsAndConditions;
