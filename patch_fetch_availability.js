import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /fetchSettings\(\);\n  \}, \[\]\);/;
const replacement = `fetchSettings();
    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/availability');
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data);
        }
      } catch (e) { console.log(e); }
    };
    fetchAvailability();
  }, []);`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationSystem.tsx', code);
    console.log('patched fetchAvailability successfully');
} else {
    console.log('failed to patch fetchAvailability');
}
