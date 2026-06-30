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
                Celý život mě přirozeně přitahuje to, co pomáhá. Nejen, že mě to baví, ale dává mi to hluboký smysl.
              </p>
              
              <p>
                Po studiu psychologie, zahradnictví, Tradiční čínské medicíny, Akademie léčivých rostlin a medicinálních hub, muzikoterapie, masáží, zdravého životního stylu, využívám mé poznatky v každodenní praxi již přes 15 let s lidmi všech věkových kategorií. 
              </p>

              <p>
                Čeká Vás tedy kvalitní masáž, citlivý přístup k Vám a Vašemu zdraví v krásném prostředí na zámku v Načeradci. 
              </p>

              <div className="pt-4 pb-2">
                <a 
                  href="https://docs.google.com/forms/d/12ojtmka1yFvwILGbfWLZmUhUskdT0shqH_wil_mMilA/viewform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gold text-white font-sans font-medium uppercase tracking-widest text-sm rounded transition-all duration-300 hover:bg-gold-dark hover:shadow-lg"
                >
                  Vyplnit dotazník ke konzultaci
                </a>
              </div>

              <p className="italic text-gold-dark text-xl font-serif pt-2">
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