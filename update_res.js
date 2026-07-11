import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
  "                                Vyberte termín\n                            </h3>",
  `                                Vyberte termín
                            </h3>
                            <span className="block text-sm text-gold-dark font-medium italic">Otevírací doba po domluvě.</span>`
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
