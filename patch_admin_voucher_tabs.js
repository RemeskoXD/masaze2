import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const oldHeaderRegex = /<h3 className="text-white font-serif text-lg">Dárkové Poukazy<\/h3>/;
const newHeader = `<h3 className="text-white font-serif text-lg">Dárkové Poukazy</h3>
                          <div className="flex bg-black/30 rounded p-1 border border-gray-700 ml-4">
                              <button 
                                  className={\`px-3 py-1 rounded text-xs transition \${voucherTab === 'active' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'}\`}
                                  onClick={() => setVoucherTab('active')}
                              >
                                  Aktivní
                              </button>
                              <button 
                                  className={\`px-3 py-1 rounded text-xs transition \${voucherTab === 'archive' ? 'bg-gray-700 text-white font-bold' : 'text-gray-400 hover:text-white'}\`}
                                  onClick={() => setVoucherTab('archive')}
                              >
                                  Archiv (Využité/Prošlé)
                              </button>
                          </div>`;

code = code.replace(oldHeaderRegex, newHeader);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched voucher tabs');
