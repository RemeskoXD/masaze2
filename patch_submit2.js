import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?const spaydString = `SPD\*1\.0\*ACC:\$\{getIban\(\)\}\*AM:\$\{depositPrice\}\.00\*CC:CZK\*X-VS:\$\{vs\}\*MSG:Zaloha Masaze \$\{surnameClean\}`\.toUpperCase\(\);/;

const newCode = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedDate || !selectedTime || !selectedService) {
      setErrorMsg('Vyberte prosím službu, datum a čas.');
      return;
    }
    setIsSubmitting(true);
    
    const parts = formData.name.trim().split(/\\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const surnameClean = surname.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-zA-Z]/g, '');

    const dateObj = new Date(selectedDate!);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const timeParts = selectedTime!.split(':');
    const vs = \`\${day}\${month}\${year}\${timeParts[0]}\${timeParts[1]}\`;

    const getIban = () => {
      const bank = "3030";
      const accNum = "3190751019";
      const bban = \`\${bank}\${"0".repeat(6)}\${accNum}\`;
      const numericIban = \`\${bban}123500\`;
      let remainder = 0;
      for (let i = 0; i < numericIban.length; i++) {
          remainder = (remainder * 10 + parseInt(numericIban[i], 10)) % 97;
      }
      const checkDigits = (98 - remainder).toString().padStart(2, '0');
      return \`CZ\${checkDigits}\${bban}\`;
    };

    const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);
    const servicePrice = selectedServiceData ? parseInt(selectedServiceData.price.replace(/[^\\d]/g, '')) || 0 : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(id => {
        const a = SERVICES_LIST.find(s => s.id === id);
        if (a) addonsPrice += parseInt(a.price.replace(/[^\\d]/g, '')) || 0;
    });
    const depositPrice = servicePrice + addonsPrice;
    const spaydString = \`SPD*1.0*ACC:\${getIban()}*AM:\${depositPrice}.00*CC:CZK*X-VS:\${vs}*MSG:Zaloha Masaze \${surnameClean}\`.toUpperCase();

    try {
        const res = await fetch('/api/reservation', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serviceId: selectedService,
                date: selectedDate,
                time: selectedTime,
                customerName: formData.name,
                phone: formData.phone,
                email: formData.email,
                note: formData.note,
                totalPrice: depositPrice,
                surnameClean,
                vs,
                website: formData.website,
                appliedVoucherCode: appliedVoucher ? appliedVoucher.voucherCode : undefined
            })
        });
        const data = await res.json();
        if (data.success) {
            setSubmitted(true);
        } else {
            setErrorMsg(data.message || 'Něco se pokazilo, zkuste to prosím znovu.');
        }
    } catch(err) {
        setErrorMsg('Chyba spojení, zkuste to prosím znovu.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (submitted) {
    const parts = formData.name.trim().split(/\\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const surnameClean = surname.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-zA-Z]/g, '');

    const dateObj = new Date(selectedDate!);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const timeParts = selectedTime!.split(':');
    const vs = \`\${day}\${month}\${year}\${timeParts[0]}\${timeParts[1]}\`;

    const getIban = () => {
      const bank = "3030";
      const accNum = "3190751019";
      const bban = \`\${bank}\${"0".repeat(6)}\${accNum}\`;
      const numericIban = \`\${bban}123500\`;
      let remainder = 0;
      for (let i = 0; i < numericIban.length; i++) {
          remainder = (remainder * 10 + parseInt(numericIban[i], 10)) % 97;
      }
      const checkDigits = (98 - remainder).toString().padStart(2, '0');
      return \`CZ\${checkDigits}\${bban}\`;
    };

    const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);
    const servicePrice = selectedServiceData ? parseInt(selectedServiceData.price.replace(/[^\\d]/g, '')) || 0 : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(id => {
        const a = SERVICES_LIST.find(s => s.id === id);
        if (a) addonsPrice += parseInt(a.price.replace(/[^\\d]/g, '')) || 0;
    });
    const depositPrice = servicePrice + addonsPrice;
    const spaydString = \`SPD*1.0*ACC:\${getIban()}*AM:\${depositPrice}.00*CC:CZK*X-VS:\${vs}*MSG:Zaloha Masaze \${surnameClean}\`.toUpperCase();
`;

code = code.replace(regex, newCode);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched handleSubmit');
