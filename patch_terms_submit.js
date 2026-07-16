import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /if \(!selectedDate \|\| !selectedTime \|\| !selectedService\) \{/;
const replacement = `if (!termsAccepted) {
      setErrorMsg('Pro odeslání rezervace musíte souhlasit s obchodními podmínkami.');
      return;
    }
    
    if (!selectedDate || !selectedTime || !selectedService) {`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched terms submit successfully');
