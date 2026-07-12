import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// 1. Add state for voucher sub-tab and voucher Use modal
const stateRegex = /const \[showVoucherModal, setShowVoucherModal\] = useState\(false\);/;
code = code.replace(
  stateRegex,
  `const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherTab, setVoucherTab] = useState('active');
  const [useVoucherModal, setUseVoucherModal] = useState(null);
  const [useVoucherAmount, setUseVoucherAmount] = useState('');`
);

// 2. Add useVoucher function
const funcRegex = /const updateVoucherStatus = async \(id: number, status: string\) => \{/;
code = code.replace(
  funcRegex,
  `const handleUseVoucher = async () => {
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
  
  const updateVoucherStatus = async (id: number, status: string) => {`
);

// 3. Update active/archive tabs UI + Filtering
// Find the <button onClick={() => setShowVoucherModal(true)} ... and wrap/add tabs
const tabsUIRegex = /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-2xl text-gold font-serif flex items-center gap-2"><Gift \/> Dárkové Poukazy<\/h2>\s*<button\s*onClick=\{\(\) => setShowVoucherModal\(true\)\}\s*className="bg-gold hover:bg-gold-dark text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition"\s*>\s*<Plus size=\{18\} \/>\s*Vytvořit nový poukaz \(ručně\)\s*<\/button>\s*<\/div>/;

const tabsUIReplacement = `<div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-6">
        <h2 className="text-2xl text-gold font-serif flex items-center gap-2"><Gift /> Dárkové Poukazy</h2>
        <div className="flex bg-black/30 rounded-lg p-1 border border-gray-700">
            <button 
                className={\`px-4 py-1.5 rounded-md text-sm transition \${voucherTab === 'active' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'}\`}
                onClick={() => setVoucherTab('active')}
            >
                Aktivní
            </button>
            <button 
                className={\`px-4 py-1.5 rounded-md text-sm transition \${voucherTab === 'archive' ? 'bg-gray-700 text-white font-bold' : 'text-gray-400 hover:text-white'}\`}
                onClick={() => setVoucherTab('archive')}
            >
                Archiv (Využité/Prošlé)
            </button>
        </div>
    </div>
    <button 
        onClick={() => setShowVoucherModal(true)}
        className="bg-gold hover:bg-gold-dark text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition"
    >
        <Plus size={18} />
        Vytvořit nový poukaz
    </button>
</div>`;

code = code.replace(tabsUIRegex, tabsUIReplacement);

// 4. Update the map to filter
const mapRegex = /\{vouchers\.map\(vouch => \(/;
const mapReplacement = `{vouchers.filter((v: any) => {
    let isExpired = false;
    if (v.validUntil) {
        const d = new Date(v.validUntil);
        if (!isNaN(d.getTime()) && d < new Date()) isExpired = true;
    }
    const isArchived = v.status === 'used' || v.status === 'cancelled' || isExpired;
    return voucherTab === 'active' ? !isArchived : isArchived;
}).map((vouch: any) => (`;
code = code.replace(mapRegex, mapReplacement);

// 5. Update Action buttons in table
const actionButtonsRegex = /\{vouch\.status === 'pending' && \(\s*<div className="flex gap-2">[\s\S]*?<\/div>\s*\)\}/;
const actionButtonsReplacement = `{vouch.status === 'pending' && (
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
                if (confirm('Opravdu chcete tento poukaz stornovat?')) {
                    updateVoucherStatus(vouch.id, 'cancelled');
                }
            }}
            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition"
            title="Stornovat poukaz"
        >
            <X size={16} />
        </button>
    </div>
)}
{vouch.status === 'paid' && (
    <div className="flex gap-2">
        <button 
            onClick={() => setUseVoucherModal(vouch)}
            className="bg-gold hover:bg-yellow-400 text-black px-3 py-1.5 rounded transition text-xs font-bold"
        >
            Uplatnit / Snížit zůstatek
        </button>
    </div>
)}`;
code = code.replace(actionButtonsRegex, actionButtonsReplacement);

// 6. Update Status label to include "Vyčerpáno / Použito"
const statusBadgeRegex = /\{vouch\.status === 'pending' \? 'Čeká na zaplacení' : vouch\.status === 'paid' \? 'Zaplaceno & Odesláno' : 'Zrušeno'\}/;
const statusBadgeReplacement = `{vouch.status === 'pending' ? 'Čeká na zaplacení' : vouch.status === 'paid' ? 'Aktivní' : vouch.status === 'used' ? 'Využitý' : 'Zrušeno'}`;
code = code.replace(statusBadgeRegex, statusBadgeReplacement);
const statusColorRegex = /vouch\.status === 'paid' \? 'bg-green-900 text-green-200 border border-green-700' :/;
const statusColorReplacement = `vouch.status === 'paid' ? 'bg-green-900 text-green-200 border border-green-700' :
vouch.status === 'used' ? 'bg-gray-800 text-gray-300 border border-gray-600' :`;
code = code.replace(statusColorRegex, statusColorReplacement);

// 7. Render Use Modal
const modalMountRegex = /\{showVoucherModal && \(/;
const useModalHTML = `{useVoucherModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0a2f1c] border border-gold/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <h4 className="text-xl text-white font-serif mb-4 text-center">Uplatnit poukaz</h4>
            <p className="text-sm text-gray-300 mb-4 text-center">
                Voucher pro: <strong className="text-gold">{useVoucherModal.recipientName}</strong><br/>
                Typ: <strong>{useVoucherModal.type === 'value' ? 'Hodnota' : 'Služba'}</strong>
            </p>
            {useVoucherModal.type === 'value' && (
                <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-1 block">Částka k odečtení (Kč)</label>
                    <input 
                        type="number"
                        placeholder="Např. 1000"
                        className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition text-center text-xl font-bold"
                        value={useVoucherAmount}
                        onChange={e => setUseVoucherAmount(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Aktuální zůstatek: <strong>{useVoucherModal.value} Kč</strong></p>
                </div>
            )}
            {(useVoucherModal.type === 'service' || useVoucherModal.type === 'manual') && (
                <p className="text-sm text-gray-400 mb-4 text-center italic">
                    Tento poukaz je na konkrétní službu. Potvrzením bude označen jako plně využitý.
                </p>
            )}
            <div className="flex gap-3">
                <button 
                    onClick={() => setUseVoucherModal(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl transition"
                >
                    Zrušit
                </button>
                <button 
                    onClick={handleUseVoucher}
                    className="flex-1 bg-gold hover:bg-yellow-500 text-black font-bold py-2 rounded-xl transition"
                >
                    Potvrdit
                </button>
            </div>
        </div>
    </div>
)}
{showVoucherModal && (`;
code = code.replace(modalMountRegex, useModalHTML);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched vouchers UI');
