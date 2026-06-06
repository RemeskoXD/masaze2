import React from 'react';
import { IMAGES } from '../constants';
import { Leaf, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-beige-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-text-dark mb-8 leading-tight">
              O mně
            </h2>
            
            <div className="space-y-6 text-text-muted font-sans leading-relaxed text-lg font-light">
              <p>
                Celý život mě přirozeně přitahuje to, co pomáhá – rostliny, houby, hudba i dotek. Nejen, že mě to baví, ale dává mi to hluboký smysl a vnitřní sílu.
              </p>
              
              <p>
                Moje cesta začala nenápadně. Na zahradě u babičky, v jejím klidu a přirozeném přístupu k životu. Vedle toho jsem ale vnímala úplně jiný svět – stres, tlak ze školy, práce i okolí. A někde mezi tím jsem začala hledat rovnováhu.
              </p>

              <p>
                Silně se mi zapsaly i zkušenosti, kdy jsem doprovázela blízké k lékařům. Následně i mé přímé zkušenosti, kdy jsem potřebovala opravdovou pomoc a místo toho jsem viděla nezájem, spěch a pouhé řešení příznaků. Chyběl mi opravdový zájem o člověka jako celek – nejen o jeho tělo, ale i psychiku a myšlení, které ovládá většinu nemocí a bolestí.
              </p>

              <p>
                Právě to mě přivedlo k hlubšímu hledání. Začala jsem studovat psychologii, fyziologii, bylinkářství, medicinální houby a k mým základům patří také studium Tradiční čínské medicíny a dlouholetá praxe v muzikoterapii i masážích. Mám toho odmasírovaného opravdu dost a jsem profesionál, který si jde vlastní cestou.
              </p>

              <p className="font-medium text-text-dark">
                Nepřestala jsem. Dnes propojuji roky praxe i teorie do toho, co dělám.
              </p>

              <p>
                U mě najdete nejen skutečně kvalitní masáž v krásném prostředí na zámku v Načeradci, ale i citlivý přístup k Vám a Vašemu zdraví.
              </p>

              <p className="italic text-gold-dark text-xl font-serif pt-4">
                Těším se na setkání.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gold/10">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                    <Leaf className="text-gold-dark" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-medium text-text-dark">Bylinná péče & houby</span>
                </div>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                    <Sparkles className="text-gold-dark" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-medium text-text-dark">Redoxní molekuly</span>
                </div>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                    <Heart className="text-gold-dark" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-medium text-text-dark">Celostní přístup</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative group px-4 sm:px-12"
          >
            <div className="absolute inset-0 bg-gold/10 rounded-t-[10rem] rounded-b-[2rem] transform translate-x-4 translate-y-4"></div>
            <img 
              src={IMAGES.owner} 
              alt="Tereza Rozkošná" 
              className="relative rounded-t-[10rem] rounded-b-[2rem] shadow-2xl w-full object-cover h-[600px] sepia-[.1] hover:sepia-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;