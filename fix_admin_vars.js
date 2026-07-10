import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = `  const [closedDates, setClosedDates] = useState<string>('');`;

const newStr = `  const [closedDates, setClosedDates] = useState<string>('');
  
  // Pagination state
  const [resPage, setResPage] = useState(1);
  const resItemsPerPage = 10;
  
  // Derived state for pagination
  const resTotalPages = Math.max(1, Math.ceil(reservations.length / resItemsPerPage));
  const currentReservations = reservations.slice((resPage - 1) * resItemsPerPage, resPage * resItemsPerPage);`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('components/AdminPanel.tsx', code);
