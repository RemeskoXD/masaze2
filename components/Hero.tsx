import React from 'react';
import { IMAGES } from '../constants';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES.massage3} 
          alt="Relaxační atmosféra" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-beige-bg/90 via-beige-bg/60 to-beige-bg"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 inline-block select-none"
        >
            <span className="text-gold-dark tracking-[0.25em] sm:tracking-[0.38em] uppercase text-xs md:text-sm font-semibold border-b-2 border-gold/40 pb-2.5">
                Péče o tělo i duši
            </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-text-dark mb-4 tracking-[0.06em] sm:tracking-widest leading-[1.05] sm:leading-[0.95] drop-shadow-md font-medium uppercase"
        >
          MOJE<br/><span className="text-gradient-gold italic pr-2 sm:pr-4 font-semibold">REGENERACE</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mb-12 text-gold-dark tracking-[0.3em] sm:tracking-[0.45em] uppercase text-sm md:text-xl font-semibold select-none drop-shadow-sm"
        >
          NÁVRAT K SOBĚ
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-2xl md:text-3xl text-text-muted font-light italic mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          "Objevte sílu zpomalení, uvolnění napětí a znovunalezení přirozené rovnováhy."
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed font-sans font-light mb-12 tracking-wide space-y-4"
        >
          <p>
            V mé péči se potkává vědomý a citlivý dotek se silou bylin, medicinálních hub a opravdu celostním přístupem, který jde do hloubky.
          </p>
          <p>
            Nečekejte jen obyčejnou masáž.<br />Vytvářím pro Vás bezpečný prostor, kde můžete na chvíli úplně vypnout, odložit starosti a znovu se zhluboka nadechnout.<br />
            <strong>Dopřejte si péči a regeneraci, která má smysl.</strong>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a 
            href="#reservation" 
            className="group relative w-64 py-4 bg-gold text-white font-medium text-sm uppercase tracking-[0.2em] overflow-hidden rounded-full transition-all duration-500 hover:shadow-[0_0_40px_rgba(197,168,128,0.4)] hover:-translate-y-1"
          >
            <span className="relative z-10">Rezervovat termín</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
          </a>
          <a 
            href="#services" 
            className="w-64 py-4 border border-gold/50 text-text-dark font-medium text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-white hover:border-gold transition-all duration-500 backdrop-blur-sm rounded-full"
          >
            Nabídka služeb
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gold cursor-pointer hover:text-gold-dark transition"
      >
        <a href="#about" aria-label="Posunout dolů">
            <ChevronDown size={36} strokeWidth={1.5} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;