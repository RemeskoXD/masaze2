import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /INSERT INTO reservations \(id, serviceId, date, time, customerName, phone, email, note, totalPrice, vs, status, createdAt\)\s*VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)/;
code = code.replace(regex, `INSERT INTO reservations (id, serviceId, date, time, customerName, phone, email, note, totalPrice, vs, status, createdAt, voucherCode)\n           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const regex2 = /\[resId, serviceId, date, time, customerName, phone, email, note \|\| '', finalPrice, vs \|\| '', req\.body\.isAdminManual \? 'confirmed' : 'pending', new Date\(\)\.toISOString\(\)\]/;
code = code.replace(regex2, `[resId, serviceId, date, time, customerName, phone, email, note || '', finalPrice, vs || '', req.body.isAdminManual ? 'confirmed' : 'pending', new Date().toISOString(), appliedVoucherCode || null]`);

fs.writeFileSync('server.ts', code);
console.log('patched insert');
