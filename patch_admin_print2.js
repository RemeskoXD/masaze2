import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// Replace the Tisk / PDF button behavior to open new window
const oldButton = `<button 
                                                      onClick={() => setPrintVoucher(vouch)}
                                                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition text-xs font-bold border border-gray-600 mt-2"
                                                  >
                                                      Tisk / PDF
                                                  </button>`;
                                                  
const newButton = `<button 
                                                      onClick={() => {
                                                          window.open(\`/api/admin/voucher/\${vouch.id}/print?token=\${adminToken}\`, '_blank');
                                                      }}
                                                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition text-xs font-bold border border-gray-600 mt-2"
                                                  >
                                                      Tisk / PDF
                                                  </button>`;
                                                  
code = code.replace(oldButton, newButton);

// Restore window.open in createManualVoucher
const oldCreate = /setPrintVoucher\(data\.voucher\);/;
const newCreate = `window.open(\`/api/admin/voucher/\${data.voucher.id}/print?token=\${adminToken}\`, '_blank');`;
code = code.replace(oldCreate, newCreate);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('reverted to window.open print');
