import fs from 'fs';
let code = fs.readFileSync('components/Navigation.tsx', 'utf8');

const topbar = `    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 pointer-events-none"
    >
      <div className="bg-deep-green/95 backdrop-blur-sm text-gold py-1.5 text-center text-xs tracking-widest uppercase font-medium shadow-sm pointer-events-auto w-full">
        Otevírací doba po domluvě
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pointer-events-none">
      <nav `;

code = code.replace(
  `    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"
    >
      <nav `,
  topbar
);

// close the div
code = code.replace(
  `      </nav>
    </motion.div>`,
  `      </nav>
      </div>
    </motion.div>`
);

fs.writeFileSync('components/Navigation.tsx', code);
