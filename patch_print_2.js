import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /app\.get\('\/api\/admin\/voucher\/:id\/print', requireAdmin, async \(req, res\) => \{[\s\S]*?res\.send\(html\);\n    \} catch \(err\) \{\n      res\.status\(500\)\.send\('Error'\);\n    \}\n  \}\);/g;

const newEndpoint = `app.get('/api/admin/voucher/:id/print', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.query('SELECT * FROM vouchers WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) return res.status(404).send('Not found');
      
      const voucher = rows[0];
      
      let validUntilText = "";
      if (voucher.validUntil) {
          const validDate = new Date(voucher.validUntil);
          if (!isNaN(validDate.getTime())) {
              validUntilText = "PLATNOST DO: " + validDate.toLocaleDateString('cs-CZ');
          } else {
              validUntilText = "PLATNOST DO: " + voucher.validUntil;
          }
      }
      
      const html = \`
      <!DOCTYPE html>
      <html lang="cs">
      <head>
          <meta charset="UTF-8">
          <title>Dárkový Poukaz - \${voucher.voucherCode}</title>
          <style>
              body { margin: 0; padding: 0; background: #525659; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Arial', sans-serif; }
              
              .print-area { 
                  width: 297mm; 
                  height: 210mm; 
                  background-color: white; 
                  position: relative; 
                  box-shadow: 0 0 20px rgba(0,0,0,0.5);
                  overflow: hidden;
              }
              
              @media print {
                  @page { size: A4 landscape; margin: 0; }
                  body { background: white; padding: 0; align-items: flex-start; justify-content: flex-start; }
                  .print-area { box-shadow: none; width: 100vw; height: 100vh; page-break-after: avoid; }
                  .no-print { display: none !important; }
              }
              
              .bg-image {
                  position: absolute;
                  top: 0; left: 0; width: 100%; height: 100%;
                  background-image: url('/poukaz.jpeg');
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                  z-index: 1;
              }
              
              .text-overlay {
                  position: absolute;
                  z-index: 2;
                  color: #513123;
                  font-family: 'Georgia', serif;
                  font-style: italic;
                  font-size: 28pt;
                  white-space: nowrap;
              }
              
              .text-recipient {
                  top: 45.2%; 
                  left: 33%;
              }
              
              .text-value {
                  top: 66%; 
                  left: 20%;
              }
              
              .text-validity {
                  top: 80%;
                  left: 20%;
                  font-size: 14pt;
                  font-family: 'Arial', sans-serif;
                  font-style: normal;
                  font-weight: bold;
                  color: #7b624d;
              }
              
              .text-code {
                  bottom: 7%; 
                  right: 5%;
                  font-size: 14pt;
                  font-family: 'Courier New', monospace;
                  font-style: normal;
                  color: #111; 
                  font-weight: bold;
              }
              
              .controls { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 100; }
              .btn { padding: 10px 20px; background: #113f28; color: #d4af37; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-family: 'Arial', sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s; }
              .btn:hover { background: #1c5e3f; transform: translateY(-2px); }
          </style>
      </head>
      <body>
          <div class="controls no-print">
              <button class="btn" onclick="window.print()">Vytisknout / Uložit jako PDF</button>
              <button class="btn" style="background: #e2e8f0; color: #475569;" onclick="window.close()">Zavřít</button>
          </div>
          
          <div class="print-area">
              <div class="bg-image"></div>
              <div class="text-overlay text-recipient">\${voucher.recipientName}</div>
              <div class="text-overlay text-value">\${voucher.summary}</div>
              \${validUntilText ? \`<div class="text-overlay text-validity">\${validUntilText}</div>\` : ''}
              <div class="text-overlay text-code">\${voucher.voucherCode}</div>
          </div>
          <script>
            setTimeout(() => {
                window.print();
            }, 500);
          </script>
      </body>
      </html>
      \`;
      res.send(html);
    } catch (err) {
      res.status(500).send('Error');
    }
  });`;

code = code.replace(regex, newEndpoint);
fs.writeFileSync('server.ts', code);
console.log('patched print template');
