import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const newUseVoucher = `
  const handleUseVoucher = async () => {
      if (!useVoucherModal) return;
      if (useVoucherModal.type === 'value') {
          if (!useVoucherAmount || isNaN(parseInt(useVoucherAmount))) {
              if (!confirm('Nezadali jste částku k odečtení. Přejete si poukaz označit jako plně využitý (vyčerpaný)?')) return;
          }
      }
      try {
          const payload = { amountToDeduct: useVoucherModal.type === 'value' ? (parseInt(useVoucherAmount) || 0) : 0 };
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

const oldUseVoucherRegex = /const handleUseVoucher = async \(\) => \{[\s\S]*?alert\('Chyba při uplatnění poukazu\.'\);\s*\}\s*\};/;
code = code.replace(oldUseVoucherRegex, newUseVoucher.trim());

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched handleUseVoucher');
