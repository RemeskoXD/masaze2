import fs from 'fs';
let code = fs.readFileSync('migrate-db.ts', 'utf8');

code = code.replace(
/console\.log\('✅ Tabulky byly vytvořeny\.'\);/,
`await connection.execute(\`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        author VARCHAR(255),
        rating INT,
        text TEXT,
        date VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    \`);
    console.log('✅ Tabulky byly vytvořeny.');`
);

fs.writeFileSync('migrate-db.ts', code);
