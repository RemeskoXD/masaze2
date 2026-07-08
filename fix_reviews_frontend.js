import fs from 'fs';
let code = fs.readFileSync('components/Reviews.tsx', 'utf8');

// replace the state initialization and add useEffect
code = code.replace(/const \[reviews, setReviews\] = useState\(\(\) => \{[\s\S]*?return MOCK_REVIEWS;\s*\}\);/,
`const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          // We can combine MOCK_REVIEWS with DB reviews, or just use DB reviews if they are already combined.
          // Since MOCK_REVIEWS might not be in DB yet, let's prepend them with DB reviews.
          const customReviews = data.map((d: any) => ({
            id: d.id,
            author: d.author,
            rating: d.rating,
            text: d.text,
            date: d.date
          }));
          setReviews([...MOCK_REVIEWS, ...customReviews]);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, []);`);

// replace handleSubmit
code = code.replace(/const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?setNewReview\(\{ name: '', text: '', rating: 5 \}\);/,
`const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newObj = {
      author: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: 'Ověřená recenze (Dnes)'
    };
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObj)
      });
      if (res.ok) {
        const data = await res.json();
        const createdReview = { ...newObj, id: data.id };
        setReviews(prev => [...prev, createdReview]);
        
        alert("Recenze byla úspěšně přidána a hned se zobrazí v seznamu!");
        setShowForm(false);
        setNewReview({ name: '', text: '', rating: 5 });
      }
    } catch (e) {
      alert("Chyba při odesílání recenze");
    }
`);

fs.writeFileSync('components/Reviews.tsx', code);
