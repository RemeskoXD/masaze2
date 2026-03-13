import React from 'react';
import { SERVICES_LIST, IMAGES } from '../constants';
import { Clock, Star, Info, AlertTriangle, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-beige-dark relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={12} className="text-gold" fill="currentColor" />
            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">Ceník & Služby</span>
            <Star size={12} className="text-gold" fill="currentColor" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-text-dark mt-3 mb-6">Investice do vašeho zdraví</h2>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          <p className="mt-6 text-text-muted max-w-2xl mx-auto">
            Při pravidelné docházce lze individuálně domluvit cenu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Service Cards Column */}
          <div className="lg:col-span-8 grid grid-cols-1 gap-6">
            {SERVICES_LIST.map((service, index) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/80 backdrop-blur-md border border-gold/20 p-8 rounded-sm hover:border-gold/50 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_rgba(212,175,55,0.2)]"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start mb-4 border-b border-gold/10 pb-5">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl font-serif text-text-dark group-hover:text-gold-dark transition-colors duration-300">
                        {service.title}
                    </h3>
                    <div className="flex items-center text-text-muted text-sm mt-2">
                        <Clock size={16} className="mr-2 text-gold" />
                        <span className="tracking-wide uppercase text-xs">{service.duration} čistého času</span>
                    </div>
                  </div>
                  <div className="flex items-center self-start bg-beige-bg px-5 py-3 rounded border border-gold/20 shadow-inner group-hover:border-gold/40 transition-colors">
                    <span className="text-2xl font-bold text-gold-dark font-sans whitespace-nowrap">{service.price}</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <p className="text-text-muted leading-relaxed max-w-lg font-light text-lg">{service.description}</p>
                    <a href="#reservation" className="w-full md:w-auto text-center px-8 py-3 bg-transparent border border-gold text-gold-dark text-xs font-bold uppercase tracking-[0.15em] hover:bg-gold hover:text-white transition-all rounded-sm">
                        Objednat
                    </a>
                </div>
              </motion.div>
            ))}

            {/* Mobilní masérka Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-4 bg-white/60 border border-gold/30 p-6 rounded-sm flex items-start gap-4"
            >
              <Info className="text-gold flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-text-dark mb-1">Jsem i mobilní masérka</h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  Dojedu k vám na firmu či domů. Sazba <strong>6 Kč / 1 km</strong>. <br/>
                  Je potřeba vzdušný prostor alespoň 2,5 m x 2 metry a přístup k tekoucí vodě.
                </p>
              </div>
            </motion.div>
            
            {/* Additional Offerings Horizontal Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 bg-white border border-gold/20 p-8 rounded-sm relative overflow-hidden shadow-xl"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-2xl font-serif text-gold-dark mb-6 relative z-10 flex items-center gap-3">
                <Leaf className="text-gold" size={24} /> Léčivé byliny & medicinální houby
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="text-center md:text-left border-l-2 border-gold/30 pl-4 hover:border-gold transition-colors duration-300">
                  <h4 className="font-bold text-text-dark mb-2 text-md">Varianta 1</h4>
                  <p className="text-sm text-text-muted font-light">Natrhám si sama/sám a chci doporučené dávkování na míru.</p>
                </div>
                <div className="text-center md:text-left border-l-2 border-gold/30 pl-4 hover:border-gold transition-colors duration-300">
                  <h4 className="font-bold text-text-dark mb-2 text-md">Varianta 2</h4>
                  <p className="text-sm text-text-muted font-light">Varianta 1 + chci upravit celkově doplňky stravy, aby to dávalo smysl.</p>
                </div>
                <div className="text-center md:text-left border-l-2 border-gold/30 pl-4 hover:border-gold transition-colors duration-300">
                  <h4 className="font-bold text-text-dark mb-2 text-md">Varianta 3 (Online)</h4>
                  <p className="text-sm text-text-muted font-light">Varianta 1+2 + celkové poradenství zdravého životního stylu a cvičení ve formě vychytávek, které nejsou nuda.</p>
                </div>
              </div>
            </motion.div>

            {/* Kontraindikace */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 bg-red-50/50 border border-red-200 p-8 rounded-sm"
            >
              <h3 className="text-2xl font-serif text-red-800 mb-4 flex items-center gap-3">
                <AlertTriangle size={24} /> Kontraindikace
              </h3>
              <div className="text-sm text-text-muted space-y-4 font-light leading-relaxed">
                <p>
                  Kontraindikací masáží je souhrn stavů, kdy masáž nelze provést, aby nedošlo ke zhoršení zdravotního stavu. Zahrnuje akutní a infekční nemoci, horečku, záněty, nádorová onemocnění, závažná krvácivá onemocnění, kožní problémy, akutní úrazy, onemocnění dutiny břišní, silnou únavu, stavy po operacích. Dále při menses, poranění, křečové žíly, akutní psychózy, epilepsie, období šestinedělí.
                </p>
                <p>
                  <strong>Masáž nelze provádět bezprostředně po jídle, vždy min. hodinu po jídle.</strong><br/>
                  Důvody pro odmítnutí zákazníka: nevhodné chování (pod vlivem alkoholu, drog, či arogance). Služby jsou prováděny na zdravých jedincích. Při činnosti se neprovádí žádné výkony na nemocné kůži, manipulace s jizvami a mateřskými znaménky, výkony na sliznicích, oční spojivce a rohovce apod.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-red-900/80 font-medium">
                  <li>Kardiostimulátor</li>
                  <li>Gravidita - mimo těhotenské masáže, neprovádí se první 3 měsíce</li>
                  <li>Maligní nádorové onemocnění</li>
                  <li>Veškerá akutní kožní onemocnění (ekzém, lupenka, furunkl, atd.)</li>
                  <li>Hnisavá, plísňová, virová kožní onemocnění (pásový opar, bradavice, atd.)</li>
                  <li>Kožní onemocnění vyvolaná parazity (svrab, zavšivení, atd.)</li>
                  <li>Alergie na používané oleje, krémy, masti, emulze</li>
                </ul>
                <p className="font-bold text-red-800 mt-4">
                  Vždy je nutné maséra o jakémkoli zdravotním omezení informovat před masáží.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Side Image Column */}
          <div className="lg:col-span-4 hidden lg:block relative h-full min-h-[600px]">
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="sticky top-24"
             >
                <div className="absolute inset-0 border border-gold/30 transform translate-x-4 translate-y-4 rounded-sm"></div>
                <img 
                 src={IMAGES.massage1} 
                 alt="Detail masáže" 
                 className="relative w-full h-[800px] object-cover rounded-sm shadow-2xl filter brightness-105 contrast-105 sepia-[0.05] hover:sepia-0 transition duration-700"
               />
               <div className="absolute bottom-8 left-8 right-8 bg-white/95 p-6 backdrop-blur-md border-l-2 border-gold shadow-lg">
                   <p className="text-gold-dark italic font-serif text-lg leading-relaxed">"Každá masáž je rituál. Cena odráží nejen čas, ale i kvalitu péče, energii a přírodní produkty nejvyšší kvality."</p>
               </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;