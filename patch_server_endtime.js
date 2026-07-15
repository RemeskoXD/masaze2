import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex1 = /let \{ serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs, website, appliedVoucherCode \} = req\.body;/;
const replacement1 = `let { serviceId, date, time, endTime, customerName, phone, email, note, totalPrice, surnameClean, vs, website, appliedVoucherCode } = req.body;`;

if (regex1.test(code)) {
    code = code.replace(regex1, replacement1);
    fs.writeFileSync('server.ts', code);
    console.log('patched server endtime 1 successfully');
} else {
    console.log('failed to match regex server endtime 1');
}

const regex2 = /\`INSERT INTO reservations \(id, serviceId, date, time, customerName, phone, email, note, totalPrice, vs, status, createdAt, voucherCode\)\n           VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)\`,/;
const replacement2 = `\`INSERT INTO reservations (id, serviceId, date, time, endTime, customerName, phone, email, note, totalPrice, vs, status, createdAt, voucherCode)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,`;

if (regex2.test(code)) {
    code = code.replace(regex2, replacement2);
    fs.writeFileSync('server.ts', code);
    console.log('patched server endtime 2 successfully');
} else {
    console.log('failed to match regex server endtime 2');
}

const regex3 = /\[resId, serviceId, date, time, customerName, phone, email, note \|\| '', finalPrice, vs \|\| '', req\.body\.isAdminManual \? 'confirmed' : 'pending', new Date\(\)\.toISOString\(\), appliedVoucherCode \|\| null\]/;
const replacement3 = `[resId, serviceId, date, time, endTime || null, customerName, phone, email, note || '', finalPrice, vs || '', req.body.isAdminManual ? 'confirmed' : 'pending', new Date().toISOString(), appliedVoucherCode || null]`;

if (regex3.test(code)) {
    code = code.replace(regex3, replacement3);
    fs.writeFileSync('server.ts', code);
    console.log('patched server endtime 3 successfully');
} else {
    console.log('failed to match regex server endtime 3');
}
