import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

code = code.replace(
  "  useEffect(() => {\n    const fetchSettings",
  "  useEffect(() => {\n" +
  "    const handleSelectService = (e: any) => {\n" +
  "      const detail = e.detail;\n" +
  "      if (detail && detail.serviceId) {\n" +
  "        setSelectedService(detail.serviceId);\n" +
  "        goToStep(2);\n" +
  "      }\n" +
  "    };\n" +
  "    window.addEventListener('selectServiceEvent', handleSelectService);\n" +
  "    return () => {\n" +
  "      window.removeEventListener('selectServiceEvent', handleSelectService);\n" +
  "    };\n" +
  "  }, []);\n\n" +
  "  useEffect(() => {\n" +
  "    const fetchSettings"
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
