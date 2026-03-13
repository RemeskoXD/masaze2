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
              Proč si vybrat <br/><span className="text-gold-dark italic">právě mé masáže</span>
            </h2>
            
            <div className="space-y-6 text-text-muted font-sans leading-relaxed text-lg font-light">
              <p>
                Ve své praxi kombinuji masáže zaměřené na uvolnění, regeneraci a podporu samoléčby těla, doplňky MediHub, léčivé rostliny a redoxní molekuly.
              </p>
              
              <div className="bg-white/50 border-l-2 border-gold/50 p-6 my-8">
                <h3 className="font-serif text-xl text-gold-dark mb-2">Moje filozofie</h3>
                <p className="italic text-text-dark">
                  "Věřím, že tělo má obrovskou schopnost regenerace — když mu dáme správné podmínky."
                </p>
              </div>

              <p>
                Masáž, výživa, rostliny a moderní buněčná podpora nejsou oddělené světy. Společně tvoří funkční celek, který může přinést dlouhodobé výsledky.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gold/10">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                    <Leaf className="text-gold-dark" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-medium text-text-dark">Léčivé rostliny</span>
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