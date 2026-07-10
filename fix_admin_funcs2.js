import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

code = code.replace(
/    'Neděle': \{ start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' \}\n\n  const fetchSettings = async \(\) => \{/,
`    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });
  const [closedDates, setClosedDates] = useState<string>('');

  const fetchSettings = async () => {`
);

fs.writeFileSync('components/AdminPanel.tsx', code);
