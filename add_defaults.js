import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const defaultFunc = `    const setDefaultsForMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        
        let updated = { ...specificDates };

        for (let i = 1; i <= days; i++) {
            const d = new Date(year, month, i);
            const dateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
            const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
            
            let isOpen = true;
            let start = '08:30';
            let end = '18:00';
            let breaks = [];
            
            if (dayOfWeek === 6) {
                isOpen = false;
            } else if (dayOfWeek === 0) {
                start = '09:00';
                end = '20:00';
            } else if (dayOfWeek === 5) {
                start = '08:30';
                end = '11:30';
            } else {
                start = '08:30';
                end = '18:00';
            }
            
            updated[dateString] = { isOpen, start, end, breaks };
        }
        
        const updatedStr = JSON.stringify(updated);
        setSpecificDatesStr(updatedStr);
        updateSetting('specificDates', updatedStr);
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));`;

code = code.replace(
  "    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));",
  defaultFunc
);

fs.writeFileSync('components/AdminPanel.tsx', code);
