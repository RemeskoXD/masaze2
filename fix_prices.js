import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/let \{ serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs, website \} = req\.body;/,
`let { serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs, website } = req.body;
      totalPrice = Math.max(0, Number(totalPrice) || 0);`
);

code = code.replace(
/let \{ type, value, service, summary, amount, recipientName, senderName, email, note \} = req\.body;/,
`let { type, value, service, summary, amount, recipientName, senderName, email, note } = req.body;
      amount = Math.max(0, Number(amount) || 0);
      value = Math.max(0, Number(value) || 0);`
);

fs.writeFileSync('server.ts', code);
