import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const useVoucherFunc = `
  const deleteVoucher = async (id: number) => {
    try {
        await fetch(\`/api/admin/voucher/\${id}\`, {
            method: 'DELETE',
            headers: { 'Authorization': \`Bearer \${adminToken}\` }
        });
        fetchData(adminToken);
    } catch (e) { console.error(e); }
  };

  const handleUseVoucher = async () => {
      if (!useVoucherModal) return;
      try {
          const payload = { amountToDeduct: useVoucherModal.type === 'value' ? parseInt(useVoucherAmount) : 0 };
          const res = await fetch(\`/api/admin/voucher/\${useVoucherModal.id}/use\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${adminToken}\` },
              body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
              setUseVoucherModal(null);
              setUseVoucherAmount('');
              fetchData(adminToken);
          } else {
              alert('Chyba: ' + data.message);
          }
      } catch (e) {
          alert('Chyba při uplatnění poukazu.');
      }
  };
`;

code = code.replace(/const updateVoucherStatus = async/, useVoucherFunc + "\n  const updateVoucherStatus = async");

// Fix the "Stornovat" buttons logic
const newActionButtons = `
                                      <td className="p-4">
                                          {vouch.status === 'pending' && (
                                              <div className="flex gap-2">
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm(\`Opravdu si přejete potvrdit přijetí platby za poukaz pro '\${vouch.recipientName}'? Tímto krokem bude vygenerován unikátní kód poukazu a odeslán dárci na e-mail: \${vouch.email}.\`)) {
                                                              updateVoucherStatus(vouch.id, 'paid');
                                                          }
                                                      }}
                                                      className="bg-green-600 hover:bg-green-500 text-white p-2 rounded transition"
                                                      title="Potvrdit platbu"
                                                  >
                                                      <Check size={16} />
                                                  </button>
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm('Opravdu chcete tento poukaz stornovat? Bude přesunut do archivu.')) {
                                                              updateVoucherStatus(vouch.id, 'cancelled');
                                                          }
                                                      }}
                                                      className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded transition"
                                                      title="Stornovat poukaz"
                                                  >
                                                      <X size={16} />
                                                  </button>
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm('Opravdu to chcete smazat? Tento krok je nevratný.')) {
                                                              deleteVoucher(vouch.id);
                                                          }
                                                      }}
                                                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition"
                                                      title="Smazat poukaz navždy"
                                                  >
                                                      <Trash size={16} />
                                                  </button>
                                              </div>
                                          )}
                                          {vouch.status === 'paid' && (
                                              <div className="flex flex-col gap-2">
                                                  <button 
                                                      onClick={() => setUseVoucherModal(vouch)}
                                                      className="bg-gold hover:bg-yellow-400 text-black px-3 py-1.5 rounded transition text-xs font-bold"
                                                  >
                                                      Uplatnit / Snížit zůstatek
                                                  </button>
                                                  <div className="flex gap-2 mt-2">
                                                      <button 
                                                          onClick={() => {
                                                              if (confirm(\`Opravdu chcete stornovat tento již schválený dárkový poukaz? Bude přesunut do archivu.\`)) {
                                                                  updateVoucherStatus(vouch.id, 'cancelled');
                                                              }
                                                          }}
                                                          className="text-gray-400 hover:text-gray-300 text-[10px] uppercase font-bold tracking-widest border border-gray-600 px-2 py-1 rounded"
                                                      >
                                                          Stornovat
                                                      </button>
                                                      <button 
                                                          onClick={() => {
                                                              if (confirm(\`Opravdu to chcete smazat? Tento krok je nevratný.\`)) {
                                                                  deleteVoucher(vouch.id);
                                                              }
                                                          }}
                                                          className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest border border-red-900 px-2 py-1 rounded"
                                                      >
                                                          Smazat
                                                      </button>
                                                  </div>
                                              </div>
                                          )}
                                          {(vouch.status === 'used' || vouch.status === 'cancelled' || (vouch.validUntil && new Date(vouch.validUntil) < new Date())) && (
                                              <div className="flex gap-2">
                                                  <button 
                                                      onClick={() => {
                                                          if (confirm('Opravdu to chcete smazat? Tento krok je nevratný.')) {
                                                              deleteVoucher(vouch.id);
                                                          }
                                                      }}
                                                      className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest border border-red-900 px-2 py-1 rounded"
                                                  >
                                                      Smazat navždy
                                                  </button>
                                              </div>
                                          )}
                                      </td>`;

// Let's replace the whole <td> with actions
const tdRegex = /<td className="p-4">\s*\{vouch\.status === 'pending' && \([\s\S]*?<\/td>/;
code = code.replace(tdRegex, newActionButtons);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched voucher actions');
