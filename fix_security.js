import fs from 'fs';
import crypto from 'crypto';

let code = fs.readFileSync('server.ts', 'utf8');

// 1. Ošetření Express JSON payload limitu
code = code.replace(/app\.use\(express\.json\(\{ limit: '10mb' \}\)\);/, "app.use(express.json({ limit: '100kb' }));");
if (!code.includes("limit: '100kb'")) {
    // Pro jistotu
    code = code.replace(/app\.use\(express\.json\(\)\);/, "app.use(express.json({ limit: '100kb' }));");
}

// 2. Bezpečnostní fix pro requireAdmin
code = code.replace(
/if \(token === 'admin123'\) \{ \/\/ in real world, use secure token\/password logic/,
`if (token === process.env.ADMIN_TOKEN) {`
);

// 3. Ořezávání a validace vstupů pro Recenze + Bezpečnější ID
code = code.replace(
/const { author, rating, text, date } = req\.body;/,
`let { author, rating, text, date } = req.body;
      author = String(author || '').substring(0, 100).trim();
      text = String(text || '').substring(0, 1000).trim();
      rating = Number(rating) || 5;`
);

code = code.replace(
/const id = Date\.now\(\);/g,
`// Zamezení kolize v jedné milisekundě
      const id = Date.now() * 1000 + Math.floor(Math.random() * 1000);`
);

// 4. Ořezávání vstupů u Rezervace
code = code.replace(
/const { serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs, website } = req\.body;/,
`let { serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs, website } = req.body;
      customerName = String(customerName || '').substring(0, 100).trim();
      phone = String(phone || '').substring(0, 50).trim();
      email = String(email || '').substring(0, 100).trim();
      note = String(note || '').substring(0, 1000).trim();`
);

// Ošetření Date.now() i u resId a vId
code = code.replace(
/resId = Date\.now\(\);/,
`resId = Date.now() * 1000 + Math.floor(Math.random() * 1000);`
);

code = code.replace(
/const vId = Date\.now\(\);/,
`const vId = Date.now() * 1000 + Math.floor(Math.random() * 1000);`
);

fs.writeFileSync('server.ts', code);
