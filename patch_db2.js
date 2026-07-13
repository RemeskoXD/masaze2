import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /await connection\.query\("CREATE TABLE IF NOT EXISTS reservations \([\s\S]*?CURRENT_TIMESTAMP\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"\);/;
code = code.replace(regex, `await connection.query("CREATE TABLE IF NOT EXISTS reservations (id INT AUTO_INCREMENT PRIMARY KEY, serviceId INT NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(10) NOT NULL, customerName VARCHAR(100) NOT NULL, phone VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, note TEXT, totalPrice INT NOT NULL, status VARCHAR(20) DEFAULT 'Nová', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, voucherCode VARCHAR(50), vs VARCHAR(50)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");\n    try { await connection.query("ALTER TABLE reservations ADD COLUMN voucherCode VARCHAR(50);"); } catch(e) {}\n    try { await connection.query("ALTER TABLE reservations ADD COLUMN vs VARCHAR(50);"); } catch(e) {}`);
fs.writeFileSync('server.ts', code);
console.log('patched 2');
