import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const oldParse = `              if (typeof data.specificDates === 'string') {
                setSpecificDates(JSON.parse(data.specificDates));
              } else {
                setSpecificDates(data.specificDates);
              }`;

const newParse = `              let parsed = data.specificDates;
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              setSpecificDates(parsed || {});`;

code = code.replace(oldParse, newParse);
fs.writeFileSync('components/ReservationSystem.tsx', code);
