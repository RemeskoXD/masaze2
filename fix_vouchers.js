import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

const oldVoucherLogic = `      const db = await getDB();
      const newVoucher = {
        id: Date.now(),
        type,
        value: type === 'value' ? parseInt(value) : null,
        service: type === 'service' ? service : null,
        summary,
        amount,
        recipientName,
        senderName,
        email,
        note,
        status: 'pending', // 'pending' | 'paid' | 'cancelled'
        voucherCode: '',
        createdAt: new Date().toISOString()
      };

      db.vouchers.push(newVoucher);
      await saveDB(db);`;

const newVoucherLogic = `      const vId = Date.now();
      await pool.query(
        \`INSERT INTO vouchers (id, type, value, service, summary, amount, recipientName, senderName, email, note, status, voucherCode, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
        [vId, type, type === 'value' ? parseInt(value) : null, type === 'service' ? service : null, summary, amount, recipientName, senderName, email, note || '', 'pending', '', new Date().toISOString()]
      );
      
      const newVoucher = {
        id: vId,
        type,
        value: type === 'value' ? parseInt(value) : null,
        service: type === 'service' ? service : null,
        summary,
        amount,
        recipientName,
        senderName,
        email,
        note,
        status: 'pending'
      };`;

code = code.replace(oldVoucherLogic, newVoucherLogic);
fs.writeFileSync('server.ts', code);
