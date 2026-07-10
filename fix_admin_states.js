import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = `  const [thankYouModalReservation, setThankYouModalReservation] = useState<any>(null);`;

const newStr = `  const [thankYouModalReservation, setThankYouModalReservation] = useState<any>(null);
  
  const [cancelModalReservation, setCancelModalReservation] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAlternativeTermin, setCancelAlternativeTermin] = useState('');

  const [rescheduleModalReservation, setRescheduleModalReservation] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const [backupRestoreMsg, setBackupRestoreMsg] = useState('');

  const handleOpenCancelModal = (res: any) => {
      setCancelModalReservation(res);
      setCancelReason('');
      setCancelAlternativeTermin('');
  };

  const openRescheduleModal = (res: any) => {
      setRescheduleModalReservation(res);
      setRescheduleDate('');
      setRescheduleTime('');
  };

  const handleReschedule = () => {
      if (!rescheduleDate || !rescheduleTime) return;
      updateReservationStatus(rescheduleModalReservation.id, 'rescheduled', undefined, rescheduleDate + ' ' + rescheduleTime);
      setRescheduleModalReservation(null);
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
          const text = await file.text();
          const json = JSON.parse(text);
          // Just a mock for now or real implementation
          setBackupRestoreMsg('Obnova dat úspěšná (Mock).');
          setTimeout(() => setBackupRestoreMsg(''), 3000);
      } catch (err) {
          setBackupRestoreMsg('Chyba při čtení souboru.');
      }
  };
`;

code = code.replace(targetStr, newStr);

// Also replace updateStatus with updateReservationStatus in JSX
code = code.replace(/updateStatus\(/g, 'updateReservationStatus(');

// Also add AdminCalendar to the imports or mock it
// The error says: Cannot find name 'AdminCalendar'
// In fact, in lines 907 and 972 we have <AdminCalendar ... /> but I named it AdminCalendarPicker? No, AdminCalendarPicker is what I added.
