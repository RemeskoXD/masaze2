import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// 1. Add import
if (!code.includes('VoucherPrintView')) {
    code = code.replace(/import ManualReservationModal from '.\/ManualReservationModal';/, "import ManualReservationModal from './ManualReservationModal';\nimport VoucherPrintView from './VoucherPrintView';");
}

// 2. Add state
const stateRegex = /const \[showVoucherModal, setShowVoucherModal\] = useState\(false\);/;
code = code.replace(stateRegex, `const [showVoucherModal, setShowVoucherModal] = useState(false);\n  const [printVoucher, setPrintVoucher] = useState<any>(null);`);

// 3. Update createManualVoucher
const createRegex = /alert\('Poukaz byl úspěšně vygenerován\.'\);\s*\/\/\s*open print modal/;
code = code.replace(createRegex, `setPrintVoucher(data.voucher);`);

// 4. Add print button to the table row actions
const tableActionRegex = /Uplatnit \/ Snížit zůstatek\s*<\/button>/;
const newAction = `Uplatnit / Snížit zůstatek
                                                  </button>
                                                  <button 
                                                      onClick={() => setPrintVoucher(vouch)}
                                                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition text-xs font-bold border border-gray-600 mt-2"
                                                  >
                                                      Tisk / PDF
                                                  </button>`;
code = code.replace(tableActionRegex, newAction);

// 5. Add VoucherPrintView to the render
const renderRegex = /\{showVoucherModal && \(/;
const printRender = `{printVoucher && (
            <VoucherPrintView voucher={printVoucher} onClose={() => setPrintVoucher(null)} />
          )}
          {showVoucherModal && (`

code = code.replace(renderRegex, printRender);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched printing');
