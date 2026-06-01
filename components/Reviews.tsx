import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_REVIEWS = [
  { id: 1, author: 'Jana', rating: 5, text: 'Masáže jsou skvělé, uvolňující, jak masáž těla, tak masáž hlavy a obličeje. Velice příjemná slečna masérka a krásné prostředí. Všem vřele doporučuji.', date: 'Ověřená recenze' },
  { id: 2, author: 'Lukáš', rating: 5, text: 'MASÁŽ SKVĚLÁ, VÝBORNÁ, UVOLŇUJÍCÍ. SUPER RELAX A ODPOČINEK PO NÁROČNÉM DNI. ČLOVĚK ODCHÁZÍ PLN SKVĚLÉ ENERGIE.', date: 'Ověřená recenze' },
  { id: 3, author: 'Karolína Petrová', rating: 5, text: 'A moooc děkujeme bylo to super jako vždy 😘 a já jsem úplně na jiné vlně kdybych nemusela teď zas řešit starosti tak bych byla víc úplně wauuuu❤️😊', date: 'Ověřená recenze' },
  { id: 4, author: 'Slávka', rating: 5, text: 'Masáže byly super, velice spokojena.', date: 'Ověřená recenze' },
  { id: 5, author: 'Zuzka', rating: 5, text: 'Terezko, máš zlaté ruce ! :-) moc děkuji !', date: 'Ověřená recenze' },
  { id: 6, author: 'Helena', rating: 5, text: 'Nejbáječnější masáž :-) Neskutečně moc děkuji', date: 'Ověřená recenze' },
  { id: 7, author: 'Jindra', rating: 5, text: 'masáže jsou naprosto úžasné, příjemné, člověk se krásně zrelaxuje a hlavně jsou účinné.... chodím pravidelně každý týden a nelituju a budu chodit i nadále ♡ :-)', date: 'Ověřená recenze' },
];

const Reviews: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });
  
  // Load reviews from localStorage + mock data
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('custom_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...MOCK_REVIEWS, ...parsed];
      } catch (e) {
        return MOCK_REVIEWS;
      }
    }
    return MOCK_REVIEWS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Dynamic responsiveness of carousel items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = Date.now();
    const newObj = {
      id: newId,
      author: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: 'Ověřená recenze (Dnes)'
    };
    
    const updatedReviews = [...reviews, newObj];
    setReviews(updatedReviews);
    
    // Save only user custom reviews to localStorage to keep it separate from static mock data
    const customOnly = updatedReviews.filter(r => !MOCK_REVIEWS.some(mock => mock.id === r.id));
    localStorage.setItem('custom_reviews', JSON.stringify(customOnly));

    alert("Recenze byla úspěšně přidána a hned se zobrazí v seznamu!");
    setShowForm(false);
    setNewReview({ name: '', text: '', rating: 5 });
    
    // Scroll automatically to the newly added review
    setTimeout(() => {
      // itemsPerView might have been updated, calculate new maxIndex
      const targetMax = Math.max(0, updatedReviews.length - itemsPerView);
      setCurrentIndex(targetMax);
    }, 100);
  };

  return (
    <section id="reviews" className="py-20 bg-beige-bg border-t border-gold/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-10"
        >
            <div>
                <h2 className="text-3xl md:text-5xl font-serif text-gold-dark mb-2">Recenze klientů</h2>
                <p className="text-text-muted">Vaše spokojenost je mou největší odměnou.</p>
            </div>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="mt-4 md:mt-0 px-6 py-2 border border-gold text-gold-dark rounded hover:bg-gold hover:text-white transition cursor-pointer"
            >
                {showForm ? 'Zavřít formulář' : 'Napsat recenzi'}
            </button>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
              <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit} 
                  className="bg-white p-6 rounded-2xl mb-10 border border-gold/30 shadow-sm overflow-hidden"
              >
                  <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                          <input 
                              type="text" 
                              placeholder="Vaše jméno" 
                              className="flex-1 bg-beige-bg p-3 rounded-lg border border-gold/30 text-text-dark focus:border-gold outline-none"
                              required
                              value={newReview.name}
                              onChange={e => setNewReview({...newReview, name: e.target.value})}
                          />
                          <select 
                              className="bg-beige-bg p-3 rounded-lg border border-gold/30 text-text-dark focus:border-gold outline-none"
                              value={newReview.rating}
                              onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                          >
                              <option value="5">★★★★★ - Vynikající</option>
                              <option value="4">★★★★☆ - Velmi dobré</option>
                              <option value="3">★★★☆☆ - Dobré</option>
                              <option value="2">★★☆☆☆ - Průměrné</option>
                              <option value="1">★☆☆☆☆ - Špatné</option>
                          </select>
                      </div>
                      <textarea 
                          placeholder="Podělte se o svou zkušenost s celostní masáží..." 
                          className="bg-beige-bg p-3 rounded-lg border border-gold/30 text-text-dark focus:border-gold outline-none h-32 resize-none"
                          required
                          value={newReview.text}
                          onChange={e => setNewReview({...newReview, text: e.target.value})}
                      ></textarea>
                      <button type="submit" className="bg-gold hover:bg-gold-dark text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer">
                        Odeslat hodnocení
                      </button>
                  </div>
              </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews Carousel Slider with left and right navigation arrows */}
        <div className="relative px-2 md:px-12">
          {/* Left Arrow */}
          {reviews.length > itemsPerView && (
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 bg-white hover:bg-gold hover:text-white text-gold-dark p-3 rounded-full shadow-md border border-gold/20 transition-all duration-300 z-10 focus:outline-none cursor-pointer"
              aria-label="Předchozí recenze"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right Arrow */}
          {reviews.length > itemsPerView && (
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 bg-white hover:bg-gold hover:text-white text-gold-dark p-3 rounded-full shadow-md border border-gold/20 transition-all duration-300 z-10 focus:outline-none cursor-pointer"
              aria-label="Další recenze"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Carousel Viewport Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out py-4 gap-0"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
                {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="px-3 shrink-0"
                      style={{ 
                        width: `${100 / itemsPerView}%`,
                        flexShrink: 0
                      }}
                    >
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-t-4 border-gold relative h-full flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(197,168,128,0.12)] transition-shadow duration-300">
                            <div>
                                <div className="flex mb-3 text-gold">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-text-muted italic mb-6 text-sm md:text-base leading-relaxed">
                                  "{review.text}"
                                </p>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-gold/10 pt-4 mt-auto">
                                <span className="font-bold text-text-dark">{review.author}</span>
                                <span className="text-xs text-text-muted">{review.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Bullet navigation indicators */}
          {reviews.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(reviews.length - itemsPerView + 1)].map((_, i) => (
                <button
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === i ? 'w-6 bg-gold' : 'w-2.5 bg-gold/20 hover:bg-gold/40'
                  }`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Přejít na snímek ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;