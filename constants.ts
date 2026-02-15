
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
    title: "Relaxační masáž",
    description: "Jemná masáž pro uvolnění stresu a napětí svalů.",
    price: "1 200 Kč",
    duration: "60 min"
  },
  {
    id: 2,
    title: "Hloubková regenerační masáž",
    description: "Intenzivnější techniky zaměřené na hluboké svalové vrstvy.",
    price: "1 500 Kč",
    duration: "60 min"
  },
  {
    id: 3,
    title: "Masáž s aromaterapií",
    description: "Kombinace masáže a éterických olejů pro harmonizaci těla i duše.",
    price: "1 400 Kč",
    duration: "60 min"
  },
  {
    id: 4,
    title: "Konzultace celostního zdraví",
    description: "Rozbor zdravotního stavu, doplňky MediHub a bylinná terapie.",
    price: "800 Kč",
    duration: "45 min"
  }
];
