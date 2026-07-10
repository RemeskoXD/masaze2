import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
/currentMinutes \+= totalBlockMinutes;\n        \}\n    \}/,
`currentMinutes += totalBlockMinutes;
        }
    }
    
    return slots;`
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
