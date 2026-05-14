import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ReservationSystem from './components/ReservationSystem';
import GiftVouchers from './components/GiftVouchers';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import FloatingContact from './components/FloatingContact';
import { IMAGES } from './constants';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientSectionEnabled, setClientSectionEnabled] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    // Fetch public settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
          if (data && data.clientSectionEnabled !== undefined) {
              setClientSectionEnabled(data.clientSectionEnabled);
          }
      })
      .catch(err => console.error("Could not load settings:", err));

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="bg-beige-bg text-text-dark font-sans antialiased selection:bg-gold selection:text-white">
      <Navigation clientSectionEnabled={clientSectionEnabled} />
      <main>
        <Hero />
        <About />
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 h-48 md:h-64"
        >
           <motion.img variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 0.8, scale: 1 } }} whileHover={{ opacity: 1, scale: 1.05, zIndex: 10 }} src={IMAGES.massage2} alt="Atmosphere" className="w-full h-full object-cover object-[50%_35%] transition-all duration-500 origin-center" />
           <motion.img variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 0.8, scale: 1 } }} whileHover={{ opacity: 1, scale: 1.05, zIndex: 10 }} src={IMAGES.massage4} alt="Candles" className="w-full h-full object-cover object-[50%_35%] transition-all duration-500 origin-center" />
           <motion.img variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 0.8, scale: 1 } }} whileHover={{ opacity: 1, scale: 1.05, zIndex: 10 }} src={IMAGES.massage5} alt="Oils" className="w-full h-full object-cover object-[50%_35%] transition-all duration-500 origin-center" />
           <motion.img variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 0.8, scale: 1 } }} whileHover={{ opacity: 1, scale: 1.05, zIndex: 10 }} src={IMAGES.massage6} alt="Relax" className="w-full h-full object-cover object-[50%_35%] transition-all duration-500 origin-center" />
        </motion.div>

        <Services />
        <ReservationSystem />
        <GiftVouchers />
        
        {/* Placeholders pro e-shop a klientskou sekci */}
        <section id="eshop" className="py-24 bg-beige-bg text-center border-t border-gold/10">
          <h2 className="text-3xl font-serif text-text-dark mb-4">Medicinální houby a rostliny</h2>
          <p className="text-text-muted">E-shop pro vás právě připravujeme. Již brzy zde najdete naši nabídku.</p>
        </section>

        {clientSectionEnabled && (
        <section id="client-area" className="py-24 bg-white text-center border-t border-gold/10">
          <h2 className="text-3xl font-serif text-text-dark mb-4">Klientská sekce</h2>
          <p className="text-text-muted mb-8">Přihlášení do partnerského e-shopu (MediHub)</p>
          <button className="bg-gold/50 cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-colors">Připravujeme</button>
        </section>
        )}

        <Reviews />
      </main>
      <Footer />
      <FloatingContact />
      
      {/* Floating Admin Link for Demo Purposes */}
      <a href="#admin" className="fixed bottom-2 right-2 text-[10px] text-gray-700 hover:text-gold opacity-50 z-10">Admin</a>
    </div>
  );
};

export default App;