import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const oldCode = `    setIsSubmitting(true);

    const parts = formData.name.trim().split(/\\s+/);`;

const newCode = `    setIsSubmitting(true);
    
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
                totalPrice: servicePrice + addonsPrice,
                surnameClean: formData.name.trim().split(/\\s+/).pop().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-zA-Z]/g, ''),
                vs: \`\${new Date(selectedDate!).getDate().toString().padStart(2, '0')}\${(new Date(selectedDate!).getMonth() + 1).toString().padStart(2, '0')}\${new Date(selectedDate!).getFullYear().toString().slice(-2)}\${selectedTime!.split(':')[0]}\${selectedTime!.split(':')[1]}\`,
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
    const parts = formData.name.trim().split(/\\s+/);`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched reservation system');
