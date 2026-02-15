import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ReservationSystem from './components/ReservationSystem';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import FloatingContact from './components/FloatingContact';
import { IMAGES } from './constants';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple hash router for admin switching without reload
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="bg-deep-green text-soft-white font-sans antialiased selection:bg-gold selection:text-deep-green">
      <Navigation />
      <main>
        <Hero />
        <About />
        
        {/* Gallery Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 h-48 md:h-64">
           {/* 
              Posunutí obrázků dolů (object-[50%_35%]): 
              Obrázek se zarovná tak, že bod ve 35% jeho výšky (horní třetina) bude uprostřed.
              Tím se obrázek vizuálně posune dolů a odhalí se horní část s rukama/masáží.
           */}
           <img src={IMAGES.massage2} alt="Atmosphere" className="w-full h-full object-cover object-[50%_35%] opacity-80 hover:opacity-100 transition duration-500" />
           <img src={IMAGES.massage4} alt="Candles" className="w-full h-full object-cover object-[50%_35%] opacity-80 hover:opacity-100 transition duration-500" />
           <img src={IMAGES.massage5} alt="Oils" className="w-full h-full object-cover object-[50%_35%] opacity-80 hover:opacity-100 transition duration-500" />
           <img src={IMAGES.massage6} alt="Relax" className="w-full h-full object-cover object-[50%_35%] opacity-80 hover:opacity-100 transition duration-500" />
        </div>

        <Services />
        <ReservationSystem />
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