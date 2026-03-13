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
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold/50"></div>
            <span className="text-gold-dark uppercase tracking-[0.2em] text-xs font-semibold">Ceník & Služby</span>
            <div className="h-px w-8 bg-gold/50"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-dark mb-6">Investice do vašeho zdraví</h2>
          <p className="text-text-muted max-w-2xl mx-auto font-light text-lg">
            Při pravidelné docházce lze individuálně domluvit cenu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Service Cards Column */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {SERVICES_LIST.map((service, index) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(197,168,128,0.12)] transition-all duration-500 border border-transparent hover:border-gold/20"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 gap-2 sm:gap-4">
                  <h3 className="text-2xl md:text-3xl font-serif text-text-dark group-hover:text-gold-dark transition-colors duration-300 m-0 leading-none">
                      {service.title}
                  </h3>
                  <div className="hidden sm:block flex-grow border-b border-dotted border-gold/40 mx-2 relative top-[-8px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-xl md:text-2xl font-medium text-gold-dark font-sans whitespace-nowrap leading-none">
                      {service.price}
                  </span>
                </div>
                
                <div className="flex items-center text-text-muted text-xs uppercase tracking-[0.15em] mb-5 font-medium">
                    <Clock size={14} className="mr-2 text-gold" />
                    {service.duration} čistého času
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <p className="text-text-muted leading-relaxed max-w-lg font-light">{service.description}</p>
                    <a href="#reservation" className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-gold/50 text-gold-dark text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-white hover:border-gold transition-all rounded-full whitespace-nowrap">
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
              transition={{ duration: 0.6 }}
              className="mt-8 bg-beige-bg border border-gold/20 p-8 rounded-3xl flex flex-col sm:flex-row items-start gap-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Info className="text-gold-dark" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xl font-serif text-text-dark mb-2">Jsem i mobilní masérka</h4>
                <p className="text-text-muted font-light leading-relaxed">
                  Dojedu k vám na firmu či domů. Sazba <strong className="font-medium text-text-dark">6 Kč / 1 km</strong>. <br/>
                  Je potřeba vzdušný prostor alespoň 2,5 m × 2 metry a přístup k tekoucí vodě.
                </p>
              </div>
            </motion.div>
            
            {/* Additional Offerings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-6 bg-white border border-gold/20 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-2xl md:text-3xl font-serif text-text-dark mb-8 relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Leaf className="text-gold-dark" size={20} strokeWidth={1.5} />
                </div>
                Léčivé byliny & medicinální houby
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Varianta 1
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Natrhám si sama/sám a chci doporučené dávkování na míru.</p>
                </div>
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Varianta 2
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Varianta 1 + chci upravit celkově doplňky stravy, aby to dávalo smysl.</p>
                </div>
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Varianta 3
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Varianta 1+2 + celkové poradenství zdravého životního stylu a cvičení ve formě vychytávek, které nejsou nuda.</p>
                </div>
              </div>
            </motion.div>

            {/* Kontraindikace */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-6 bg-[#FAF7F5] border border-[#E8DCCB] p-8 md:p-10 rounded-3xl"
            >
              <h3 className="text-2xl font-serif text-[#8C6B5D] mb-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8C6B5D]/10 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-[#8C6B5D]" strokeWidth={1.5} />
                </div>
                Kontraindikace
              </h3>
              <div className="text-sm text-text-muted space-y-5 font-light leading-relaxed">
                <p>
                  Kontraindikací masáží je souhrn stavů, kdy masáž nelze provést, aby nedošlo ke zhoršení zdravotního stavu. Zahrnuje akutní a infekční nemoci, horečku, záněty, nádorová onemocnění, závažná krvácivá onemocnění, kožní problémy, akutní úrazy, onemocnění dutiny břišní, silnou únavu, stavy po operacích. Dále při menses, poranění, křečové žíly, akutní psychózy, epilepsie, období šestinedělí.
                </p>
                <p className="p-5 bg-white rounded-2xl border border-[#E8DCCB]/50 shadow-sm">
                  <strong className="font-medium text-text-dark block mb-2">Masáž nelze provádět bezprostředně po jídle, vždy min. hodinu po jídle.</strong>
                  Důvody pro odmítnutí zákazníka: nevhodné chování (pod vlivem alkoholu, drog, či arogance). Služby jsou prováděny na zdravých jedincích. Při činnosti se neprovádí žádné výkony na nemocné kůži, manipulace s jizvami a mateřskými znaménky, výkony na sliznicích, oční spojivce a rohovce apod.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Kardiostimulátor</li>
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Gravidita (první 3 měsíce)</li>
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Maligní nádorové onemocnění</li>
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Akutní kožní onemocnění</li>
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Infekční onemocnění</li>
                  <li className="flex items-start gap-3"><span className="text-[#8C6B5D] mt-0.5">•</span> Alergie na používané oleje</li>
                </ul>
                <p className="font-medium text-[#8C6B5D] mt-6 italic">
                  Vždy je nutné maséra o jakémkoli zdravotním omezení informovat před masáží.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Side Image Column */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:block relative h-full min-h-[600px]">
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="sticky top-32"
             >
                <div className="relative rounded-t-[12rem] rounded-b-[3rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)] group">
                  <img 
                   src={IMAGES.massage1} 
                   alt="Detail masáže" 
                   className="w-full h-[850px] object-cover filter brightness-105 contrast-105 sepia-[0.05] group-hover:scale-105 transition duration-1000"
                 />
                 <div className="absolute inset-0 border-[1px] border-white/40 rounded-t-[12rem] rounded-b-[3rem] m-4 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                 
                 <div className="absolute bottom-0 left-0 right-0 p-10 text-center">
                     <p className="text-white italic font-serif text-2xl leading-relaxed drop-shadow-lg">
                       "Každá masáž je rituál. Cena odráží nejen čas, ale i kvalitu péče, energii a přírodní produkty nejvyšší kvality."
                     </p>
                 </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
