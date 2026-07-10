import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = `  const handleReschedule = () => {`;

const newStr = `  const confirmSendThankYouEmail = () => {
      if (thankYouModalReservation) {
          handleSendThankYou(thankYouModalReservation.id);
      }
  };

  const handleReschedule = () => {`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('components/AdminPanel.tsx', code);
