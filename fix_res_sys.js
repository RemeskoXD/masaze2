import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const ts1 = `    const depositPrice = totalPrice;`;
const new1 = `    const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);
    const servicePrice = selectedServiceData ? parseInt(selectedServiceData.price.replace(/[^\\d]/g, '')) || 0 : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(id => {
        const a = SERVICES_LIST.find(s => s.id === id);
        if (a) addonsPrice += parseInt(a.price.replace(/[^\\d]/g, '')) || 0;
    });
    const depositPrice = servicePrice + addonsPrice;`;

code = code.replace(ts1, new1);

const ts2 = `resetForm();`;
const new2 = `        setSelectedService(null);
        setSelectedAddons([]);
        setSelectedDate(null);
        setSelectedTime(null);
        setStep(1);`;

code = code.replace(/resetForm\(\);/g, new2);

const ts3 = `onClick={() => handleServiceSelect(service.id)}`;
const new3 = `onClick={() => setSelectedService(service.id)}`;

code = code.replace(/onClick=\{\(\) => handleServiceSelect\(service\.id\)\}/g, new3);

const ts4 = `onClick={prevMonth}`;
const new4 = `onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}`;
code = code.replace(/onClick=\{prevMonth\}/g, new4);

const ts5 = `onClick={nextMonth}`;
const new5 = `onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}`;
code = code.replace(/onClick=\{nextMonth\}/g, new5);

const ts6 = `generateCalendarDays()`;
const new6 = `(() => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const firstDay = d.getDay();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Start on Monday
    const days = [];
    for (let i = 0; i < startingDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    return days;
})()`;
code = code.replace(/generateCalendarDays\(\)/g, new6);


fs.writeFileSync('components/ReservationSystem.tsx', code);
