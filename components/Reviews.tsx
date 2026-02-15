import React, { useState } from 'react';
import { Star } from 'lucide-react';

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
    <section id="reviews" className="py-20 bg-[#0a2f1c] border-t border-gold/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl md:text-5xl font-serif text-gold mb-2">Recenze klientů</h2>
                <p className="text-gray-400">Vaše spokojenost je mou největší odměnou.</p>
            </div>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="mt-4 md:mt-0 px-6 py-2 border border-gold text-gold rounded hover:bg-gold hover:text-deep-green transition"
            >
                {showForm ? 'Zavřít formulář' : 'Napsat recenzi'}
            </button>
        </div>

        {/* Review Form */}
        {showForm && (
            <form onSubmit={handleSubmit} className="bg-[#13422a] p-6 rounded-lg mb-10 border border-gold/30 animate-fade-in">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Vaše jméno" 
                            className="flex-1 bg-deep-green p-3 rounded border border-gray-600 text-white focus:border-gold outline-none"
                            required
                            value={newReview.name}
                            onChange={e => setNewReview({...newReview, name: e.target.value})}
                        />
                        <select 
                            className="bg-deep-green p-3 rounded border border-gray-600 text-white focus:border-gold outline-none"
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
                        className="bg-deep-green p-3 rounded border border-gray-600 text-white focus:border-gold outline-none h-32"
                        required
                        value={newReview.text}
                        onChange={e => setNewReview({...newReview, text: e.target.value})}
                    ></textarea>
                    <button type="submit" className="bg-gold text-deep-green font-bold py-2 rounded hover:bg-gold-light">Odeslat hodnocení</button>
                </div>
            </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="bg-[#0f3d26] p-6 rounded-lg shadow-md border-t-2 border-gold/50 relative">
                    <div className="flex mb-2 text-gold">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-gray-300 italic mb-4">"{review.text}"</p>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white">{review.author}</span>
                        <span className="text-gray-500">{review.date}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;