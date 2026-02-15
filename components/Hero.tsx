import React from 'react';
import { IMAGES } from '../constants';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES.massage3} 
          alt="Relaxační atmosféra" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1c]/90 via-[#0a2f1c]/60 to-[#0a2f1c]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24">
        <div className="mb-8 inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <span className="text-gold-light tracking-[0.4em] uppercase text-xs md:text-sm border-b border-gold/50 pb-2">
                Celostní přístup & Regenerace
            </span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-8xl text-soft-white mb-6 tracking-wide leading-tight drop-shadow-2xl animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          TEREZA <span className="text-gradient-gold font-medium">ROZKOŠNÁ</span>
        </h1>
        
        <p className="font-serif text-xl md:text-3xl text-gray-200 font-light italic mb-10 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          "Objevte sílu doteku, který léčí tělo, duši i mysl v srdci Načeradce."
        </p>
        
        <div className="mt-8 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed font-sans font-light mb-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <p>
            Věnuji se masážím s přesahem do celkového zdraví. Propojuji regenerační techniky s bylinnou terapií, doplňky MediHub a redoxními molekulami.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{animationDelay: '1s'}}>
          <a 
            href="#reservation" 
            className="group relative w-64 py-4 bg-gold text-deep-green font-bold text-lg uppercase tracking-wider overflow-hidden rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-1"
          >
            <span className="relative z-10">Rezervovat termín</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </a>
          <a 
            href="#services" 
            className="w-64 py-4 border border-gold text-gold font-bold text-lg uppercase tracking-wider hover:bg-gold hover:text-deep-green transition-all duration-300 backdrop-blur-sm rounded-sm"
          >
            Nabídka služeb
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gold/70 cursor-pointer hover:text-gold transition">
        <a href="#about" aria-label="Posunout dolů">
            <ChevronDown size={36} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
};

export default Hero;