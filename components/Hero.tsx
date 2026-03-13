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
          className="mb-8 inline-block"
        >
            <span className="text-gold-dark tracking-[0.4em] uppercase text-xs md:text-sm border-b border-gold/50 pb-2">
                Celostní přístup & Regenerace
            </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-8xl text-text-dark mb-6 tracking-wide leading-tight drop-shadow-sm"
        >
          TEREZA <span className="text-gradient-gold font-medium">ROZKOŠNÁ</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-xl md:text-3xl text-text-muted font-light italic mb-10 max-w-3xl mx-auto"
        >
          "Objevte sílu doteku, který léčí tělo, duši i mysl v srdci Načeradce."
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed font-sans font-light mb-12"
        >
          <p>
            Věnuji se masážím s přesahem do celkového zdraví. Propojuji regenerační techniky s bylinnou terapií, doplňky MediHub a redoxními molekulami.
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
            className="group relative w-64 py-4 bg-gold text-white font-bold text-lg uppercase tracking-wider overflow-hidden rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-1"
          >
            <span className="relative z-10">Rezervovat termín</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </a>
          <a 
            href="#services" 
            className="w-64 py-4 border border-gold text-gold-dark font-bold text-lg uppercase tracking-wider hover:bg-gold hover:text-white transition-all duration-300 backdrop-blur-sm rounded-sm"
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