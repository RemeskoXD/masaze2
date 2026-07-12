import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const deleteEndpoint = `
  app.delete('/api/admin/voucher/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM vouchers WHERE id = ?', [parseInt(id)]);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba' });
    }
  });
`;

code = code.replace(/app\.get\('\/api\/admin\/vouchers',/, deleteEndpoint + "\n  app.get('/api/admin/vouchers',");

fs.writeFileSync('server.ts', code);
console.log('patched server for voucher delete');
