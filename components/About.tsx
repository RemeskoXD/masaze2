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
            <h2 className="text-3xl md:text-4xl font-serif text-gold-dark mb-8">
              Proč si vybrat právě mé masáže
            </h2>
            
            <div className="space-y-6 text-text-muted font-sans leading-relaxed text-lg">
              <p>
                Ve své praxi kombinuji masáže zaměřené na uvolnění, regeneraci a podporu samoléčby těla, doplňky MediHub, léčivé rostliny a redoxní molekuly.
              </p>
              
              <div className="bg-white/50 border border-gold/30 p-6 rounded-lg my-8">
                <h3 className="font-serif text-xl text-gold-dark mb-4">Moje filozofie</h3>
                <p className="italic text-text-dark">
                  "Věřím, že tělo má obrovskou schopnost regenerace — když mu dáme správné podmínky."
                </p>
              </div>

              <p>
                Masáž, výživa, rostliny a moderní buněčná podpora nejsou oddělené světy. Společně tvoří funkční celek, který může přinést dlouhodobé výsledky.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center text-center">
                  <Leaf className="text-gold mb-2" size={32} />
                  <span className="text-sm">Léčivé rostliny</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Sparkles className="text-gold mb-2" size={32} />
                  <span className="text-sm">Redoxní molekuly</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Heart className="text-gold mb-2" size={32} />
                  <span className="text-sm">Celostní přístup</span>
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
            className="order-1 lg:order-2 relative group"
          >
            <div className="absolute -inset-4 bg-gold/20 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={IMAGES.owner} 
              alt="Tereza Rozkošná" 
              className="relative rounded-lg shadow-2xl w-full object-cover h-[500px] sepia-[.1] hover:sepia-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;