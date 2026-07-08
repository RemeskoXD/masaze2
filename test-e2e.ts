import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const BASE_URL = 'http://localhost:3000';

async function runE2ETests() {
  console.log('====================================================');
  console.log('🚀 SPUŠTĚNÍ AUTOMATIZOVANÝCH END-TO-END (E2E) TESTŮ 🚀');
  console.log('====================================================\n');

  let successCount = 0;
  let failCount = 0;

  function report(testName: string, passed: boolean, details?: string) {
    if (passed) {
      console.log(`✅ [PASS] ${testName}`);
      successCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}${details ? `: ${details}` : ''}`);
      failCount++;
    }
  }

  // 1. Test: Načtení nastavení (GET /api/settings)
  try {
    const res = await fetch(`${BASE_URL}/api/settings`);
    if (res.ok) {
      const data = await res.json();
      report('Endpoint GET /api/settings je funkční', typeof data === 'object');
    } else {
      report('Endpoint GET /api/settings je funkční', false, `Status: ${res.status}`);
    }
  } catch (err: any) {
    report('Endpoint GET /api/settings je funkční', false, err.message);
  }

  // 2. Test: Odeslání rezervace s chybějícími poli (POST /api/reservation validation)
  try {
    const res = await fetch(`${BASE_URL}/api/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: 'Test' }) // Chybí služba, mail, atd.
    });
    
    if (res.status === 400) {
      const data = await res.json();
      report('Validace chybějících polí u rezervace správně vrací 400', data.success === false);
    } else {
      report('Validace chybějících polí u rezervace správně vrací 400', false, `Neočekávaný status: ${res.status}`);
    }
  } catch (err: any) {
    report('Validace chybějících polí u rezervace', false, err.message);
  }

  // 3. Test: Úspěšné vytvoření nové rezervace
  let createdReservationId: number | null = null;
  try {
    const mockReservation = {
      serviceId: 1,
      date: '2026-06-15',
      time: '14:00',
      customerName: 'Jan E2E Testovací',
      phone: '+420 777 666 555',
      email: 'e2e@test.cz',
      note: 'Moje poznámka z automatického testu.'
    };

    const res = await fetch(`${BASE_URL}/api/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockReservation)
    });

    if (res.ok) {
      const data = await res.json();
      report('Vytvoření rezervace (POST /api/reservation) proběhlo úspěšně', data.success === true);
      
      // Načteme ID z lokální DB, abychom mohli otestovat admin API
      const DB_FILE = path.join(process.cwd(), 'db.json');
      const dbContent = JSON.parse(await fs.readFile(DB_FILE, 'utf-8'));
      const found = dbContent.reservations.find((r: any) => r.customerName === 'Jan E2E Testovací');
      if (found) {
        createdReservationId = found.id;
      }
    } else {
      report('Vytvoření rezervace (POST /api/reservation) proběhlo úspěšně', false, `Status: ${res.status}`);
    }
  } catch (err: any) {
    report('Vytvoření rezervace (POST /api/reservation)', false, err.message);
  }

  // 4. Test: Admin přihlášení (POST /api/admin/login)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Terezka2026.!' })
    });
    if (res.ok) {
      const data = await res.json();
      report('Admin přihlášení s platným heslem vrací token', data.success === true && !!data.token);
    } else {
      report('Admin přihlášení s platným heslem vrací token', false, `Status: ${res.status}`);
    }
  } catch (err: any) {
    report('Admin přihlášení s platným heslem', false, err.message);
  }

  // 5. Test: Zabezpečení admin route (GET /api/admin/reservations bez tokenu)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/reservations`, {
      headers: { 'Authorization': 'Bearer neplatny_token' }
    });
    report('Zabezpečení admin route správně vrací status 401 Unauthorized při neplatném tokenu', res.status === 401);
  } catch (err: any) {
    report('Zabezpečení admin route', false, err.message);
  }

  // 6. Test: Změna stavu rezervace administrátorem (s platným tokenem)
  if (createdReservationId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/reservation/${createdReservationId}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Terezka2026.!'
        },
        body: JSON.stringify({ status: 'confirmed' })
      });
      if (res.ok) {
        const data = await res.json();
        report('Změna stavu rezervace administrátorem na "confirmed"', data.success === true);
      } else {
        report('Změna stavu rezervace administrátorem', false, `Status: ${res.status}`);
      }
    } catch (err: any) {
      report('Změna stavu rezervace administrátorem', false, err.message);
    }
  } else {
    report('Test změny stavu rezervace přeskočen (rezervace neexistuje)', false);
  }

  // Úklid po testu: odstraníme testovací údaje, abychom neznečišťovali databázi
  try {
    const DB_FILE = path.join(process.cwd(), 'db.json');
    const dbContent = JSON.parse(await fs.readFile(DB_FILE, 'utf-8'));
    dbContent.reservations = dbContent.reservations.filter((r: any) => r.customerName !== 'Jan E2E Testovací');
    await fs.writeFile(DB_FILE, JSON.stringify(dbContent, null, 2), 'utf-8');
    report('Sanitace databáze po dokončení testovací sady', true);
  } catch (err: any) {
    report('Sanitace databáze po dokončení testovací sady', false, err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 SOUHRN E2E TESTŮ: Usplnilo se: ${successCount} | Selhalo se: ${failCount}`);
  if (failCount === 0) {
    console.log('✨ VŠECHNY E2E FUNKČNÍ SCÉNÁŘE JSOU V POŘÁDKU! SYSTÉM BĚŽÍ BEZ CHYBY.');
  } else {
    console.log('⚠️ NĚKTERÉ TESTY SELHALY. ZKONTROLUJTE, ZDA BĚŽÍ DEV SERVER.');
  }
  console.log('====================================================\n');
}

// Spustit testy pouze v případě, že je spouštěn jako samostatný script
runE2ETests().catch(console.error);
