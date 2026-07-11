import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `async function initDB() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query("CREATE TABLE IF NOT EXISTS settings (setting_key VARCHAR(50) PRIMARY KEY, setting_value JSON) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    await connection.query("CREATE TABLE IF NOT EXISTS reviews (id INT AUTO_INCREMENT PRIMARY KEY, author VARCHAR(100) NOT NULL, rating INT NOT NULL DEFAULT 5, text TEXT NOT NULL, date VARCHAR(20) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    await connection.query("CREATE TABLE IF NOT EXISTS reservations (id INT AUTO_INCREMENT PRIMARY KEY, serviceId INT NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(10) NOT NULL, customerName VARCHAR(100) NOT NULL, phone VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, note TEXT, totalPrice INT NOT NULL, status VARCHAR(20) DEFAULT 'Nová', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    await connection.query("CREATE TABLE IF NOT EXISTS vouchers (id INT AUTO_INCREMENT PRIMARY KEY, voucherType VARCHAR(50) NOT NULL, amount INT NOT NULL, recipientName VARCHAR(100) NOT NULL, buyerName VARCHAR(100) NOT NULL, buyerEmail VARCHAR(100) NOT NULL, buyerPhone VARCHAR(50) NOT NULL, personalMessage TEXT, deliveryMethod VARCHAR(20) NOT NULL, shippingAddress TEXT, status VARCHAR(20) DEFAULT 'Nový', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    connection.release();
    console.log('Database tables verified/initialized successfully.');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

async function startServer() {
  await initDB();`;

code = code.replace("async function startServer() {", replacement);
fs.writeFileSync('server.ts', code);
