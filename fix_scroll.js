import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
  "const [step, setStep] = useState(1);",
  "const [step, setStep] = useState(1);\n  const goToStep = (newStep: number) => { setStep(newStep); setTimeout(() => { const el = document.getElementById('reservation'); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({top: y, behavior: 'smooth'}); } }, 50); };"
);

code = code.replace(/setStep\((1|2|3)\)/g, 'goToStep($1)');

fs.writeFileSync('components/ReservationSystem.tsx', code);
