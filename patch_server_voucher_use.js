import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf-8');

const useEndpoint = `
  app.post('/api/admin/voucher/:id/use', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { amountToDeduct } = req.body;
      
      const [rows]: any = await pool.query('SELECT * FROM vouchers WHERE id = ?', [parseInt(id)]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
      
      const voucher = rows[0];
      
      if (voucher.type === 'service' || voucher.type === 'manual') {
          // 'manual' type without explicit value handling can also just be marked as used
          // Wait, 'manual' might be a value voucher. We should allow marking it as used.
          if (amountToDeduct > 0 && voucher.value > 0) {
              const newVal = voucher.value - amountToDeduct;
              if (newVal <= 0) {
                  await pool.query('UPDATE vouchers SET status = ?, value = ? WHERE id = ?', ['used', 0, parseInt(id)]);
              } else {
                  await pool.query('UPDATE vouchers SET value = ? WHERE id = ?', [newVal, parseInt(id)]);
              }
          } else {
              await pool.query('UPDATE vouchers SET status = ? WHERE id = ?', ['used', parseInt(id)]);
          }
      } else if (voucher.type === 'value') {
          if (amountToDeduct > 0) {
              const newVal = voucher.value - amountToDeduct;
              if (newVal <= 0) {
                  await pool.query('UPDATE vouchers SET status = ?, value = ? WHERE id = ?', ['used', 0, parseInt(id)]);
              } else {
                  await pool.query('UPDATE vouchers SET value = ? WHERE id = ?', [newVal, parseInt(id)]);
              }
          } else {
              await pool.query('UPDATE vouchers SET status = ? WHERE id = ?', ['used', parseInt(id)]);
          }
      } else {
          await pool.query('UPDATE vouchers SET status = ? WHERE id = ?', ['used', parseInt(id)]);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba' });
    }
  });
`;

code = code.replace(/app\.get\('\/api\/admin\/vouchers',/, useEndpoint + "\n  app.get('/api/admin/vouchers',");

fs.writeFileSync('server.ts', code);
console.log('patched server for voucher use');
