import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regexState = /const \[errorMsg, setErrorMsg\] = useState<string \| null>\(null\);/;
const replacementState = `const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);`;

code = code.replace(regexState, replacementState);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched terms state successfully');
