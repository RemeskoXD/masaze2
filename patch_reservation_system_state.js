import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /const \[specificDates, setSpecificDates\] = useState<any>\(\{\}\);/;
const replacement = `const [specificDates, setSpecificDates] = useState<any>({});
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationSystem.tsx', code);
    console.log('patched state successfully');
} else {
    console.log('failed to patch state');
}
