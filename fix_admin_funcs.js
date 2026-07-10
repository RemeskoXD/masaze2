import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const missingFuncs = `
  const fetchSettings = async () => {
    try {
        const res = await fetch('/api/settings');
        if (res.ok) {
            const data = await res.json();
            if (data.clientSectionEnabled) setClientSectionEnabled(data.clientSectionEnabled);
            if (data.openingHours) setOpeningHours(data.openingHours);
            if (data.closedDates) setClosedDates(data.closedDates);
        }
    } catch (e) {
        console.error(e);
    }
  };

  const fetchData = async (token: string) => {
    try {
        const res1 = await fetch('/api/admin/reservations', { headers: { 'Authorization': \`Bearer \${token}\` } });
        if (res1.ok) {
            const data1 = await res1.json();
            setReservations(data1.reservations || []);
        }
        const res2 = await fetch('/api/admin/vouchers', { headers: { 'Authorization': \`Bearer \${token}\` } });
        if (res2.ok) {
            const data2 = await res2.json();
            setVouchers(data2.vouchers || []);
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result.success) {
                setAdminToken(result.token);
                setIsAuthenticated(true);
                fetchData(result.token);
                fetchSettings();
            } else {
                setLoginError('Nesprávné heslo');
            }
        } else {
            setLoginError('Chyba serveru - neplatná odpověď');
        }
    } catch (e) {
        setLoginError('Chyba spojení');
    } finally {
        setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
        await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${adminToken}\`
            },
            body: JSON.stringify({ [key]: value })
        });
    } catch (e) {
        console.error(e);
    }
  };

  const updateOpeningHours = (day: string, type: string, val: string) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], [type]: val }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };

  const updateReservationStatus = async (id: number, status: string, reason?: string, alternativeTermin?: string) => {
    try {
        await fetch(\`/api/admin/reservations/\${id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${adminToken}\` },
            body: JSON.stringify({ status, reason, alternativeTermin })
        });
        fetchData(adminToken);
    } catch (e) { console.error(e); }
  };

  const updateVoucherStatus = async (id: number, status: string, voucherCode?: string) => {
    try {
        await fetch(\`/api/admin/vouchers/\${id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${adminToken}\` },
            body: JSON.stringify({ status, voucherCode })
        });
        fetchData(adminToken);
    } catch (e) { console.error(e); }
  };

  const handleBackup = async () => {
    try {
        const res = await fetch('/api/admin/backup', { headers: { 'Authorization': \`Bearer \${adminToken}\` } });
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup.json';
        a.click();
    } catch (e) { console.error(e); }
  };

  const [thankYouModalReservation, setThankYouModalReservation] = useState<any>(null);

  const handleSendThankYou = async (id: number) => {
    setIsLoading(true);
    try {
        const response = await fetch(\`/api/admin/reservation/\${id}/thankyou\`, {
            method: 'POST',
            headers: { 'Authorization': \`Bearer \${adminToken}\` }
        });
`;

code = code.replace(
/  \}\);\n  const \[closedDates, setClosedDates\] = useState<string>\(''\);\n        if \(response\.ok\) \{/,
  missingFuncs + '\n        if (response.ok) {'
);

fs.writeFileSync('components/AdminPanel.tsx', code);
