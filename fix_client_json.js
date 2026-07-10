import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(/if \(data\.specificDates\) \{ try \{ setSpecificDates\(JSON\.parse\(data\.specificDates\)\); \} catch\(e\)\{\} \}/,
`if (data.specificDates) {
            try {
              if (typeof data.specificDates === 'string') {
                setSpecificDates(JSON.parse(data.specificDates));
              } else {
                setSpecificDates(data.specificDates);
              }
            } catch(e){}
          }`);

fs.writeFileSync('components/ReservationSystem.tsx', code);
