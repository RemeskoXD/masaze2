import React from 'react';
import { SERVICES_LIST, IMAGES } from '../constants';
import { Clock, Check, Star } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-[#0c3620] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={12} className="text-gold" fill="currentColor" />
            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">Ceník & Služby</span>
            <Star size={12} className="text-gold" fill="currentColor" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-soft-white mt-3 mb-6">Investice do vašeho zdraví</h2>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Service Cards Column */}
          <div className="lg:col-span-8 grid grid-cols-1 gap-6">
            {SERVICES_LIST.map((service) => (
              <div key={service.id} className="group relative bg-[#0f3d26]/80 backdrop-blur-md border border-gold/10 p-8 rounded-sm hover:border-gold/50 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start mb-4 border-b border-white/5 pb-5">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl font-serif text-gold-light group-hover:text-gold transition-colors duration-300">
                        {service.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                        <Clock size={16} className="mr-2 text-gold/60" />
                        <span className="tracking-wide uppercase text-xs">{service.duration} čistého času</span>
                    </div>
                  </div>
                  <div className="flex items-center self-start bg-[#082215] px-5 py-3 rounded border border-gold/20 shadow-inner group-hover:border-gold/40 transition-colors">
                    <span className="text-2xl font-bold text-gold font-sans whitespace-nowrap">{service.price}</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <p className="text-gray-300 leading-relaxed max-w-lg font-light text-lg">{service.description}</p>
                    <a href="#reservation" className="w-full md:w-auto text-center px-8 py-3 bg-transparent border border-gold/40 text-gold text-xs font-bold uppercase tracking-[0.15em] hover:bg-gold hover:text-deep-green transition-all rounded-sm">
                        Objednat
                    </a>
                </div>
              </div>
            ))}
            
            {/* Additional Offerings Horizontal Strip */}
            <div className="mt-10 bg-gradient-to-r from-[#13422a] to-[#0f3d26] border border-gold/20 p-8 rounded-sm relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-2xl font-serif text-gold mb-8 relative z-10 flex items-center gap-3">
                <span className="w-8 h-px bg-gold inline-block"></span> Doplňkový sortiment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="text-center md:text-left border-l border-gold/20 pl-6 hover:border-gold transition-colors duration-300 group cursor-default">
                  <h4 className="font-bold text-white mb-2 text-lg group-hover:text-gold transition-colors">Byliny a Houby</h4>
                  <p className="text-sm text-gray-400 font-light">Tradiční síla přírody pro podporu imunity a vitality.</p>
                </div>
                <div className="text-center md:text-left border-l border-gold/20 pl-6 hover:border-gold transition-colors duration-300 group cursor-default">
                  <h4 className="font-bold text-white mb-2 text-lg group-hover:text-gold transition-colors">MediHub</h4>
                  <p className="text-sm text-gray-400 font-light">Prémiové doplňky stravy a výživa pro vaše buňky.</p>
                </div>
                <div className="text-center md:text-left border-l border-gold/20 pl-6 hover:border-gold transition-colors duration-300 group cursor-default">
                  <h4 className="font-bold text-white mb-2 text-lg group-hover:text-gold transition-colors">E-Book</h4>
                  <p className="text-sm text-gray-400 font-light">Průvodce celostním zdravím (v prodeji).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Image Column */}
          <div className="lg:col-span-4 hidden lg:block relative h-full min-h-[600px]">
             <div className="sticky top-24">
                <div className="absolute inset-0 border border-gold/30 transform translate-x-4 translate-y-4 rounded-sm"></div>
                <img 
                 src={IMAGES.massage1} 
                 alt="Detail masáže" 
                 className="relative w-full h-[600px] object-cover rounded-sm shadow-2xl filter brightness-90 contrast-110 sepia-[0.1] hover:sepia-0 transition duration-700"
               />
               <div className="absolute bottom-8 left-8 right-8 bg-[#0a2f1c]/95 p-6 backdrop-blur-md border-l-2 border-gold shadow-lg">
                   <p className="text-gold italic font-serif text-lg leading-relaxed">"Každá masáž je rituál. Cena odráží nejen čas, ale i kvalitu péče, energii a přírodní produkty nejvyšší kvality."</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;