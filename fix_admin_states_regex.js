import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

code = code.replace(
/const \[thankYouModalReservation, setThankYouModalReservation\] = useState<any>\(null\);/g,
`const [thankYouModalReservation, setThankYouModalReservation] = useState<any>(null);

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

  const confirmSendThankYouEmail = () => {
      if (thankYouModalReservation) {
          handleSendThankYou(thankYouModalReservation.id);
      }
  };
`
);

// Also replace updateStatus with updateReservationStatus in JSX
code = code.replace(/updateStatus\(/g, 'updateReservationStatus(');

fs.writeFileSync('components/AdminPanel.tsx', code);

// Now ReservationSystem.tsx
let resCode = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');
resCode = resCode.replace(/resetForm\(\);/g, `
        setSelectedService(null);
        setSelectedAddons([]);
        setSelectedDate(null);
        setSelectedTime(null);
        setStep(1);
`);

fs.writeFileSync('components/ReservationSystem.tsx', resCode);

