import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const CookiesPolicy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cookies') {
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
              <h2 className="text-3xl font-serif text-gold-dark">Nastavení a zásady používání Cookies</h2>
              <button onClick={close} className="p-2 bg-gold/10 text-gold-dark hover:bg-gold hover:text-white rounded-full transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-text-dark font-light text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">Co jsou to Cookies?</h3>
                <p>Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě našich webových stránek. Pomáhají nám pamatovat si vaše nastavení, zajišťovat správné fungování webu a analyzovat návštěvnost. Používáme je v souladu s právními předpisy a standardem Google Consent Mode v2.</p>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">Jaké Cookies používáme?</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark">Nezbytně nutné cookies</h4>
                    <p>Tyto cookies jsou nezbytné pro správné fungování webu a nemohou být vypnuty. Zajišťují například uložení vašich preferencí ochrany soukromí nebo bezpečnostní funkce.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">Analytické cookies</h4>
                    <p>Pomáhají nám porozumět tomu, jak návštěvníci používají náš web. Shromažďují data anonymně a pomáhají nám vylepšovat strukturu a obsah stránek (např. Google Analytics).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">Marketingové cookies</h4>
                    <p>Používají se ke sledování návštěvníků napříč weby. Záměrem je zobrazovat relevantní a poutavé reklamy pro jednotlivého uživatele (aktuálně nevyužíváme aktivně pro remarketing, ale technicky jsou podporovány Google Consent Mode v2).</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">Správa vašich preferencí</h3>
                <p>Při první návštěvě jste měli možnost zvolit si, jaké cookies můžeme používat, prostřednictvím naší vyskakovací lišty. Pokud chcete své rozhodnutí změnit, můžete smazat data o prohlížení v nastavení vašeho webového prohlížeče a lišta se vám zobrazí znovu při další návštěvě.</p>
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

export default CookiesPolicy;
