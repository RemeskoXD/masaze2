import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#privacy') {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    // Initial check
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
              <h2 className="text-3xl font-serif text-gold-dark">Zásady ochrany osobních údajů (GDPR)</h2>
              <button onClick={close} className="p-2 bg-gold/10 text-gold-dark hover:bg-gold hover:text-white rounded-full transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-text-dark font-light text-sm leading-relaxed space-y-6">
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">1. Úvodní ustanovení</h3>
                <p>Tyto zásady ochrany osobních údajů upravují zpracování osobních údajů v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).</p>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">2. Správce osobních údajů</h3>
                <p>Správcem osobních údajů je Tereza Rozkošná, IČO: 12345678 (příklad), se sídlem Zámek Načeradec 1, 257 08 Načeradec. Kontaktní e-mail: zameckemasaze@seznam.cz.</p>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">3. Účel zpracování</h3>
                <p>Osobní údaje (jméno, e-mail, telefon) zpracováváme za účelem:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Vyřízení vaší rezervace a komunikace s vámi ohledně termínu.</li>
                  <li>Odesílání informací spojených s poskytovanou službou.</li>
                  <li>Plnění zákonných povinností (účetnictví, daně).</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">4. Cookies a analytika</h3>
                <p>Tento web používá soubory cookies pro nezbytné funkce, analytiku a marketingové účely, a to v souladu s <strong>Google Consent Mode v2</strong>. Vaše preference můžete kdykoliv změnit pomocí nastavení v dolní části stránky. Analytické nástroje pomáhají zlepšovat kvalitu služeb.</p>
              </section>

              <section>
                <h3 className="text-xl font-medium font-serif text-gold-dark mb-3">5. Vaše práva</h3>
                <p>Máte právo na přístup k vašim údajům, jejich opravu, výmaz ("právo být zapomenut"), omezení zpracování a právo vznést námitku. Pro uplatnění práv nás kontaktujte na výše uvedeném e-mailu.</p>
              </section>
            </div>
            
            <div className="p-6 border-t border-gold/10 bg-white flex justify-end">
              <button onClick={close} className="px-8 py-3 bg-gold text-white hover:bg-gold-dark rounded-full font-semibold transition-colors">
                Zavřít a rozumím
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicy;
