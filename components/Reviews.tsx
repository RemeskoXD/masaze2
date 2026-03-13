import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_REVIEWS = [
  { id: 1, author: 'Jana N.', rating: 5, text: 'Úžasný zážitek, Tereza má zlaté ruce. Odcházela jsem jako znovuzrozená.', date: '10. 1. 2024' },
  { id: 2, author: 'Petr K.', rating: 5, text: 'Profesionální přístup a krásné prostředí. Doporučuji masáž s aromaterapií.', date: '5. 12. 2023' },
  { id: 3, author: 'Lenka S.', rating: 5, text: 'Konečně někdo, kdo řeší problémy komplexně. Děkuji!', date: '20. 11. 2023' },
];

const Reviews: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Recenze odeslána ke schválení. Děkujeme!");
    setShowForm(false);
    setNewReview({ name: '', text: '', rating: 5 });
  };

  return (
    <section id="reviews" className="py-20 bg-beige-bg border-t border-gold/10">
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
                className="mt-4 md:mt-0 px-6 py-2 border border-gold text-gold-dark rounded hover:bg-gold hover:text-white transition"
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
                  className="bg-white p-6 rounded-lg mb-10 border border-gold/30 shadow-sm overflow-hidden"
              >
                  <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                          <input 
                              type="text" 
                              placeholder="Vaše jméno" 
                              className="flex-1 bg-beige-bg p-3 rounded border border-gold/30 text-text-dark focus:border-gold outline-none"
                              required
                              value={newReview.name}
                              onChange={e => setNewReview({...newReview, name: e.target.value})}
                          />
                          <select 
                              className="bg-beige-bg p-3 rounded border border-gold/30 text-text-dark focus:border-gold outline-none"
                              value={newReview.rating}
                              onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                          >
                              <option value="5">★★★★★</option>
                              <option value="4">★★★★☆</option>
                              <option value="3">★★★☆☆</option>
                              <option value="2">★★☆☆☆</option>
                              <option value="1">★☆☆☆☆</option>
                          </select>
                      </div>
                      <textarea 
                          placeholder="Podělte se o svou zkušenost..." 
                          className="bg-beige-bg p-3 rounded border border-gold/30 text-text-dark focus:border-gold outline-none h-32"
                          required
                          value={newReview.text}
                          onChange={e => setNewReview({...newReview, text: e.target.value})}
                      ></textarea>
                      <button type="submit" className="bg-gold text-white font-bold py-2 rounded hover:bg-gold-dark transition-colors">Odeslat hodnocení</button>
                  </div>
              </motion.form>
          )}
        </AnimatePresence>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border-t-2 border-gold/50 relative"
                >
                    <div className="flex mb-2 text-gold">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-text-muted italic mb-4">"{review.text}"</p>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-text-dark">{review.author}</span>
                        <span className="text-text-muted">{review.date}</span>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;