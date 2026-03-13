
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
  address: 'Vračkovice 3, 257 08 Načeradec', // Old address noted, but keeping per request
  newAddress: 'Zámek Načeradec 1, 257 08', // From image text
  phone: '739 303 702',
  phoneClean: '420739303702', // For tel: links
  email: 'celkovezdravi@gmail.com',
  ig: 'Terez Rozkošná',
  bankAccount: '', // To be filled
};

export const ADMIN_PASSWORD_HASH = 'OIHDAIUohDOIAUWD873827'; // In real app, never store passwords client side

export const SERVICES_LIST = [
  {
    id: 1,
    title: "Obličej & hlava",
    description: "Jemná a uvolňující masáž obličeje a hlavy pro dokonalou relaxaci.",
    price: "600 Kč",
    duration: "30 min"
  },
  {
    id: 2,
    title: "Plosky nohou & peeling",
    description: "Osvěžující péče o vaše chodidla spojená s jemným peelingem.",
    price: "600 Kč",
    duration: "30 min"
  },
  {
    id: 3,
    title: "Lifting obličeje, Gua Sha",
    description: "Omlazující masáž obličeje pomocí tradiční techniky Gua Sha pro prokrvení a vypnutí pleti.",
    price: "900 Kč",
    duration: "60 min"
  },
  {
    id: 4,
    title: "Svalové uvolnění",
    description: "Cílená masáž pro uvolnění ztuhlých svalů a odstranění napětí.",
    price: "700 Kč",
    duration: "30 min"
  },
  {
    id: 5,
    title: "Aroma relax hloubková",
    description: "Hloubková relaxační masáž s využitím aromaterapie pro harmonizaci těla i duše.",
    price: "1000 Kč / 1500 Kč",
    duration: "60 min / 90 min"
  },
  {
    id: 6,
    title: "Maderoterapie",
    description: "Masáž speciálními dřevěnými válečky pro odbourávání celulitidy a zpevnění těla.",
    price: "900 Kč",
    duration: "60 min"
  },
  {
    id: 7,
    title: "Dětská masáž",
    description: "Jemná a uklidňující masáž přizpůsobená dětskému tělu.",
    price: "400 Kč",
    duration: "20 min"
  },
  {
    id: 8,
    title: "Teenage masáž",
    description: "Masáž pro dospívající, pomáhá při růstových bolestech a stresu ze školy.",
    price: "600 Kč",
    duration: "40 min"
  },
  {
    id: 9,
    title: "Těhotenská masáž",
    description: "Speciální jemná masáž pro nastávající maminky (od 4. měsíce těhotenství).",
    price: "800 Kč",
    duration: "40 min"
  }
];
