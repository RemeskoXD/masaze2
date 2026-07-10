import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const replacement = `  });
  const [closedDates, setClosedDates] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.openingHours) setOpeningHours(data.openingHours);
          if (data.closedDates) setClosedDates(data.closedDates);
        }
      } catch (e) { console.log(e); }
    };
    fetchSettings();
  }, []);

  const generateTimeSlots = (serviceId: number | null, selectedAddons: number[] = [], dateStr: string | null = selectedDate) => {
    if (!serviceId) return [];
    const service = SERVICES_LIST.find(s => s.id === serviceId);
    if (!service) return [];
    const durationMatch = service.duration.match(/(\\d+)/);
    let duration = durationMatch ? parseInt(durationMatch[0]) : 60;
    selectedAddons.forEach(addonId => {
        const addon = SERVICES_LIST.find(s => s.id === addonId);
        if (addon) {
            const m = addon.duration.match(/(\\d+)/);
            if (m) duration += parseInt(m[0]);
        }
    });

    let dayOfWeek = 'Pondělí';
    if (dateStr) {
      if (closedDates.includes(dateStr)) return [];
      const d = new Date(dateStr);
      dayOfWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][d.getDay()];
    }

    const daySettings = openingHours[dayOfWeek];
    if (!daySettings || !daySettings.start || !daySettings.end) return [];
    const startParts = daySettings.start.split(':');
    const endParts = daySettings.end.split(':');
    let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    let gap = 0;
    if (duration <= 30) gap = 15;
    else if (duration === 60) gap = 30;
    else gap = 30;

    const totalBlockMinutes = duration + gap;
    const slots = [];
    
    let breakStartMinutes = -1;
    let breakEndMinutes = -1;
    if (daySettings.breakStart && daySettings.breakEnd) {
        const bs = daySettings.breakStart.split(':');
        const be = daySettings.breakEnd.split(':');
        breakStartMinutes = parseInt(bs[0]) * 60 + parseInt(bs[1]);
        breakEndMinutes = parseInt(be[0]) * 60 + parseInt(be[1]);
    }
    
    let currentMinutes = startMinutes;
    
    while (currentMinutes + duration <= endMinutes) {
        let isValid = true;
        if (breakStartMinutes !== -1 && breakEndMinutes !== -1) {
            const blockEnd = currentMinutes + duration;
            if (currentMinutes < breakEndMinutes && blockEnd > breakStartMinutes) {
                isValid = false;
                currentMinutes = breakEndMinutes;
                continue;
            }
        }
        if (isValid) {
            const h = Math.floor(currentMinutes / 60);
            const m = currentMinutes % 60;
            slots.push(\`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`);
            currentMinutes += totalBlockMinutes;
        }
    }
    return slots;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedDate || !selectedTime || !selectedService) {
      setErrorMsg('Vyberte prosím službu, datum a čas.');
      return;
    }
    setIsSubmitting(true);
`;

code = code.replace(
/  \}\);\n  const \[closedDates, setClosedDates\] = useState<string>\(''\);/,
replacement
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
