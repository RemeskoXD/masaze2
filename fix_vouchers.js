import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
/const \{ type, value, service, recipientName, senderName, email, note \} = req\.body;/,
`let { type, value, service, recipientName, senderName, email, note } = req.body;
      value = Math.max(0, Number(value) || 0);`
);

fs.writeFileSync('server.ts', code);
