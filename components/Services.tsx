import React from 'react';
import { SERVICES_LIST, IMAGES } from '../constants';
import { Clock, Star, Info, AlertTriangle, Leaf, Sparkles, Gift, Check } from 'lucide-react';
import { motion } from 'motion/react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-beige-dark relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-text-dark mb-8 leading-tight italic">
            "Dopřejte si péči, která uvolní Vaše tělo i mysl a přinese Vám skutečný pocit klidu."
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto font-light text-lg mb-4">
            Každá masáž je rituál. Cena mých služeb tak odráží nejen čas, který Vám věnuji, ale především celkovou kvalitu péče, předanou energii a špičkové přírodní produkty. 
            Při Vaší pravidelné docházce (např. 5 návštěv) se můžeme vždy domluvit na individuální zvýhodněné ceně, případně se můžete těšit na bonusovou péči k proceduře.
          </p>
          
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-gold/5 border border-gold/20 px-6 py-4 rounded-2xl mx-auto mt-6">
             <div className="flex bg-white p-2 rounded-full shadow-sm text-gold">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p className="font-medium text-text-dark text-sm sm:text-base">
               <span className="font-bold text-gold-dark uppercase tracking-wide mr-2">KE KAŽDÉ MASÁŽI NAVÍC:</span>
               Aromaterapie & lahodný bylinný čaj
             </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
            {SERVICES_LIST.filter(s => s.id !== 10 && s.id !== 11 && s.id !== 12 && s.id !== 13).map((service, index) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
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
                    {service.duration}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <p className="text-text-muted leading-relaxed max-w-md font-light">{service.description}</p>
                    <a href="#reservation" className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-gold/50 text-gold-dark text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-white hover:border-gold transition-all rounded-full whitespace-nowrap">
                        Objednat
                    </a>
                </div>
              </motion.div>
            ))}

            {/* Doplňkové služby - Baňkování a Moxa */}
            <div className="mt-16 mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-6 bg-gold/40"></div>
                <h3 className="text-2xl md:text-3xl font-serif text-gold-dark text-center italic">Doplňkové služby k masáži</h3>
                <div className="h-px w-6 bg-gold/40"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SERVICES_LIST.filter(s => s.id === 12 || s.id === 13).map((service, index) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="group relative bg-[#FAF7F5] border border-[#E8DCCB] p-8 rounded-3xl transition-all duration-500 hover:border-gold/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h4 className="text-xl md:text-2xl font-serif text-[#8C6B5D] leading-tight">
                          {service.title.replace(' (Doplňková služba)', '')}
                        </h4>
                        <div className="text-right">
                          <span className="text-xl font-semibold text-gold-dark font-sans block whitespace-nowrap">
                            {service.price}
                          </span>
                          <span className="text-xs text-text-muted font-sans flex items-center justify-end gap-1 mt-1">
                            <Clock size={12} /> {service.duration}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-muted font-light mb-6 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Speciální hýčkající balíčky */}
            <div className="mt-16 mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-6 bg-gold/40"></div>
                <h3 className="text-2xl md:text-3xl font-serif text-gold-dark text-center italic">Zvýhodněné rituální balíčky</h3>
                <div className="h-px w-6 bg-gold/40"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balíček 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(197,168,128,0.15)] transition-all duration-500 border border-transparent hover:border-gold/30 flex flex-col justify-between"
                >
                  <div className="absolute top-4 right-4 text-gold/20 group-hover:text-gold/40 transition-colors duration-300">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h4 className="text-xl md:text-2xl font-serif text-text-dark group-hover:text-gold-dark transition-colors duration-300 leading-tight">
                        Okamžitá LEHKOST těla i tváře
                      </h4>
                      <div className="text-right">
                        <span className="text-xl font-semibold text-gold-dark font-sans block whitespace-nowrap">
                          1700 Kč
                        </span>
                        <span className="text-xs text-text-muted font-sans flex items-center justify-end gap-1 mt-1">
                          <Clock size={12} /> 120 min
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs uppercase tracking-wider text-gold-dark font-semibold mb-4">Maderoterapie & Gua Sha</p>
                    <p className="text-sm text-text-muted font-light mb-6">Silná kombinace rituálů, která nastartuje celé tělo i obličej:</p>
                    
                    <ul className="space-y-3.5 mb-8">
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Viditelné tvarování a lifting pleti už po první návštěvě</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Hluboká aktivace lymfy a odvod přebytečné vody z těla</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Ruční lymfomodeling a masáž dřevěnými prvky pro štíhlejší kontury</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Obličejová masáž jadeitovými destičkami pro zmírnění otoků a rozzáření</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs text-gold-dark italic font-medium leading-tight max-w-[200px]">
                      Výsledek? Lehčí tělo, pevnější kontury a dokonale rozzářená tvář.
                    </p>
                    <a href="#reservation" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gold text-white text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold-dark transition-all rounded-full">
                      Objednat rituál
                    </a>
                  </div>
                </motion.div>

                {/* Balíček 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group relative bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(197,168,128,0.15)] transition-all duration-500 border border-transparent hover:border-gold/30 flex flex-col justify-between"
                >
                  <div className="absolute top-4 right-4 text-gold/20 group-hover:text-gold/40 transition-colors duration-300">
                    <Gift size={28} />
                  </div>
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h4 className="text-xl md:text-2xl font-serif text-text-dark group-hover:text-gold-dark transition-colors duration-300 leading-tight">
                        Rozjasňující rituál pro tvář a mysl
                      </h4>
                      <div className="text-right">
                        <span className="text-xl font-semibold text-gold-dark font-sans block whitespace-nowrap">
                          1200 Kč
                        </span>
                        <span className="text-xs text-text-muted font-sans flex items-center justify-end gap-1 mt-1">
                          <Clock size={12} /> 60 min
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs uppercase tracking-wider text-gold-dark font-semibold mb-4">Hlava & Obličej</p>
                    <p className="text-sm text-text-muted font-light mb-6">Reset, který uvidíte i ucítíte. Dopřejte si hýčkání, které Vás zastaví v čase:</p>
                    
                    <ul className="space-y-3.5 mb-8">
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Šetrné povrchové odlíčení pleti pro dokonalou čistotu (mimo řasy)</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Výživná a revitalizující pleťová maska pro hloubkovou péči</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Jemná ruční masáž obličeje a hlavy pro zklidnění drah a uvolnění</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-text-muted font-light">
                        <span className="p-0.5 rounded-full bg-gold/10 text-gold-dark mt-0.5"><Check size={12} /></span>
                        <span>Závěrečná masáž jadeitovými destičkami pro odtok otoků a odpočatý vzhled</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs text-gold-dark italic font-medium leading-tight max-w-[200px]">
                      Výsledek? Viditelně jasnější, sametově vyhlazená a hluboce zregenerovaná pleť.
                    </p>
                    <a href="#reservation" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-gold text-white text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold-dark transition-all rounded-full">
                      Objednat rituál
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>

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
                  Dojedu k Vám na firmu či domů. Sazba <strong className="font-medium text-text-dark">6 Kč / 1 km</strong>. <br/>
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
                Přírodní byliny & medicinální houby
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Bylinné dávkování
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Chcete si byliny natrhat sami? Pomohu Vám bezpečně nastavit dávkování bylin a silných medicinálních hub přesně na míru Vašemu tělu.</p>
                </div>
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Integrace doplňků
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Předchozí bylinné poradenství rozšíříme o celkovou revizi Vašich stávajících doplňků stravy, abychom odstranili duplicity a vše dávalo smysl.</p>
                </div>
                <div className="group">
                  <h4 className="font-sans font-medium text-gold-dark mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-px bg-gold/50 group-hover:w-10 transition-all duration-300"></span> Celostní průvodce
                  </h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">Kompletní balíček bylin a doplňků spojený s poradenstvím pro zdravý životní styl a cvičením formou hravých, efektivních vychytávek, které Vás budou bavit.</p>
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
                  Kontraindikací masáží je souhrn stavů, kdy masáž nelze provést, aby nedošlo ke zhoršení zdravotního stavu. Zahrnují akutní a infekční nemoci, horečku, záněty, nádorová onemocnění, závažná krvácivá onemocnění, kožní problémy, akutní úrazy, onemocnění dutiny břišní, silnou únavu a stavy po operacích. Dále je masáž nevhodná při menses, poraněních, křečových žilách, akutních psychózách, epilepsii nebo v období šestinedělí.
                </p>
                <p className="p-5 bg-white rounded-2xl border border-[#E8DCCB]/50 shadow-sm">
                  <strong className="font-medium text-text-dark block mb-2">Masáž nelze provádět bezprostředně po jídle, vždy min. hodinu po jídle.</strong>
                  Důvody pro odmítnutí klienta: nevhodné či arogantní chování a stav pod vlivem alkoholu nebo drog. Služby jsou prováděny na zdravých jedincích. Při činnosti se neprovádí žádné výkony na nemocné kůži, manipulace s jizvami, mateřskými znaménky, sliznicemi apod.
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
        </div>
      </section>
    );
  };
  
  export default Services;
