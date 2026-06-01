
// Base URL for images provided by the user
const IMG_BASE = 'https://web2.itnahodinu.cz/masaze2/';

// API Endpoint - CHANGE THIS IF YOUR PHP FILE NAME IS DIFFERENT
export const API_BASE_URL = 'https://web2.itnahodinu.cz/masaze2/api.php';

export const IMAGES = {
  // Respecting case sensitivity from the screenshot
  massage1: `${IMG_BASE}masaze1.jpeg`,
  massage2: `${IMG_BASE}Masaze2.jpeg`,
  massage3: `${IMG_BASE}masaze3.jpeg`,
  massage4: `${IMG_BASE}Masaze4.jpeg`,
  massage5: `${IMG_BASE}Masaze5.jpeg`,
  massage6: `${IMG_BASE}masaze6.jpeg`,
  owner: `${IMG_BASE}masazemajitelka.jpeg`,
  placeholder: 'https://picsum.photos/800/600',
};

export const CONTACT_INFO = {
  name: 'Tereza Rozkošná',
  ico: '02178265',
  address: 'Zámek Načeradec 1, 257 08 Načeradec',
  subtitle: '',
  phone: '739 303 702',
  phoneClean: '420739303702', // Pro tel: odkazy
  email: 'celkovezdravi@gmail.com',
  ig: 'Terez Rozkošná',
  bankAccount: '3190751019/3030',
  bankName: 'Air Bank',
  iban: 'CZ03 3030 0000 0031 9075 1019',
  swift: 'AIRACZPP',
};

export const SERVICES_LIST = [
  {
    id: 1,
    title: "Masáž obličeje a hlavy",
    description: "Jemná a uvolňující masáž obličeje a hlavy pro dokonalou relaxaci.",
    price: "600 Kč",
    duration: "30 min"
  },
  {
    id: 2,
    title: "Masáž plosek nohou s peelingem",
    description: "Osvěžující péče o vaše chodidla spojená s jemným peelingem.",
    price: "600 Kč",
    duration: "30 min"
  },
  {
    id: 3,
    title: "Liftingová masáž obličeje a Gua Sha",
    description: "Omlazující masáž obličeje pomocí tradiční techniky Gua Sha pro prokrvení a vypnutí pleti.",
    price: "900 Kč",
    duration: "60 min"
  },
  {
    id: 4,
    title: "Hloubková masáž pro svalové uvolnění",
    description: "Cílená masáž pro uvolnění ztuhlých svalů a odstranění napětí.",
    price: "700 Kč",
    duration: "30 min"
  },
  {
    id: 5,
    title: "Hloubková aromatická relaxační masáž",
    description: "Hloubková relaxační masáž s využitím aromaterapie pro harmonizaci těla i duše.",
    price: "1000 Kč",
    duration: "60 min"
  },
  {
    id: 51,
    title: "Hloubková aromatická relaxační masáž",
    description: "Hloubková relaxační masáž s využitím aromaterapie. Délka 90 min obsahuje navíc masáž hlavy a obličeje.",
    price: "1500 Kč",
    duration: "90 min"
  },
  {
    id: 6,
    title: "Maderoterapie (tvarování postavy a lymfa)",
    description: "Masáž stimulující lymfatický systém. Pomáhá tvarovat postavu, redukovat celulitidu pomocí speciálních technik a dřevěných nástrojů.",
    price: "900 Kč",
    duration: "60 min"
  },
  {
    id: 7,
    title: "Jemná dětská masáž",
    description: "Jemná a uklidňující masáž přizpůsobená dětskému tělu.",
    price: "400 Kč",
    duration: "20 min"
  },
  {
    id: 8,
    title: "Uvolňující masáž pro dospívající (teenage)",
    description: "Masáž pro dospívající, pomáhá při růstových bolestech a uvolnění od celkového stresu.",
    price: "600 Kč",
    duration: "40 min"
  },
  {
    id: 9,
    title: "Pečující těhotenská masáž",
    description: "Speciální jemná masáž pro nastávající maminky (od 4. měsíce těhotenství).",
    price: "800 Kč",
    duration: "40 min"
  },
  {
    id: 10,
    title: "Maderoterapie & Gua Sha (Okamžitá LEHKOST těla i tváře)",
    description: "Okamžitá LEHKOST těla i tváře. Silná kombinace maderoterapie a masáže Gua Sha, která nastartuje tělo i pleť: viditelné tvarování, lifting, aktivace lymfy, odvod přebytečné vody, ruční lymfomodeling, masáž dřevěnými prvky a jadeitovými destičkami pro štíhlejší kontury a redukci otoků.",
    price: "1700 Kč",
    duration: "120 min"
  },
  {
    id: 11,
    title: "Rozjasňující rituál pro unavenou tvář a mysl",
    description: "Reset, který uvidíš i ucítíš. Dopřej si péči, která tě zastaví a zároveň rozzáří: šetrné odlíčení, výživná pleťová maska, ruční masáž obličeje a hlavy pro uvolnění od stresu a masáž jadeitovými destičkami pro redukci otoků a svěží vzhled. Pleť je pak viditelně jasnější, hladší a odpočatá.",
    price: "1200 Kč",
    duration: "60 min"
  }
];
