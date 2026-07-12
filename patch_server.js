import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf-8');

// Update CREATE TABLE
code = code.replace(
  /await connection\.query\("CREATE TABLE IF NOT EXISTS vouchers[\s\S]*?\);/,
  `await connection.query("CREATE TABLE IF NOT EXISTS vouchers (id BIGINT PRIMARY KEY, type VARCHAR(50), value INT, service VARCHAR(100), summary VARCHAR(255), amount INT NOT NULL, recipientName VARCHAR(100) NOT NULL, senderName VARCHAR(100), email VARCHAR(100), note TEXT, status VARCHAR(20) DEFAULT 'paid', voucherCode VARCHAR(50), createdAt VARCHAR(50), validUntil VARCHAR(50)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");`
);

// Update /api/voucher endpoint
code = code.replace(
  /INSERT INTO vouchers \(id, type, value, service, summary, amount, recipientName, senderName, email, note, status, voucherCode, createdAt\)\s*VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)/g,
  `INSERT INTO vouchers (id, type, value, service, summary, amount, recipientName, senderName, email, note, status, voucherCode, createdAt, validUntil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

code = code.replace(
  /\[vId, type, type === 'value' \? parseInt\(value\) : null, type === 'service' \? service : null, summary, amount, recipientName, senderName, email, note \|\| '', 'pending', '', new Date\(\)\.toISOString\(\)\]/,
  `[vId, type, type === 'value' ? parseInt(value) : null, type === 'service' ? service : null, summary, amount, recipientName, senderName, email, note || '', 'pending', '', new Date().toISOString(), new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()]`
);

code = code.replace(
  /\[vId, type, type === 'value' \? parseInt\(value\) : null, type === 'service' \? service : null, summary, amount \|\| 0, recipientName, senderName \|\| 'Admin', email \|\| '', note \|\| '', 'paid', finalCode, new Date\(\)\.toISOString\(\)\]/,
  `[vId, type, type === 'value' ? parseInt(value) : null, type === 'service' ? service : null, summary, amount || 0, recipientName, senderName || 'Admin', email || '', note || '', 'paid', finalCode, new Date().toISOString(), req.body.validUntil || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()]`
);

fs.writeFileSync('server.ts', code);
console.log('patched database queries');
