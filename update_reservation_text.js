import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const oldText = `<p className="text-text-muted max-w-xl mx-auto font-light text-lg">Vyberte si proceduru a termín, který Vám nejvíce vyhovuje. Vše jednoduše a elegantně online.</p>`;

const newText = `<p className="text-text-muted max-w-xl mx-auto font-light text-lg mb-3">Vyberte si proceduru a termín, který Vám nejvíce vyhovuje. Vše jednoduše a elegantně online.</p>
          <div className="inline-block bg-gold/10 text-gold-dark px-4 py-2 rounded-full text-sm font-medium tracking-wide">
            Otevírací doba po domluvě
          </div>`;

code = code.replace(oldText, newText);
fs.writeFileSync('components/ReservationSystem.tsx', code);
