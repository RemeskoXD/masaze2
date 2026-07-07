import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    // Here you would integrate Google Consent Mode v2 logic:
    // gtag('consent', 'update', { 'ad_storage': 'granted', 'analytics_storage': 'granted', ... });
    setIsVisible(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('cookie_consent', 'necessary');
    // gtag('consent', 'update', { 'ad_storage': 'denied', 'analytics_storage': 'denied', ... });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full bg-white border-t border-gold/20 shadow-2xl z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-text-dark font-light flex-1">
              <h3 className="font-serif text-xl font-bold text-gold-dark mb-2">Vaše soukromí je pro nás důležité</h3>
              <p>
                K poskytování nejlepších služeb používáme soubory cookie. Slouží k personalizaci obsahu, 
                poskytování funkcí sociálních médií a analýze naší návštěvnosti (v souladu s Google Consent Mode v2 a GDPR). 
                Kliknutím na „Přijmout vše“ souhlasíte s používáním všech cookies. Můžete také povolit pouze nezbytné.
                Více informací naleznete v našich <a href="#privacy" className="text-gold-dark hover:underline font-medium">Zásadách ochrany osobních údajů</a>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={handleNecessaryOnly} 
                className="px-6 py-2.5 rounded-full border border-gold text-gold-dark hover:bg-gold/5 font-semibold text-sm transition-colors"
              >
                Pouze nezbytné
              </button>
              <button 
                onClick={handleAcceptAll} 
                className="px-6 py-2.5 rounded-full bg-gold text-white hover:bg-gold-dark font-semibold text-sm transition-colors"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
