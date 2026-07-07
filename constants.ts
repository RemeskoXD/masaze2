
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
  email: 'zameckemasaze@seznam.cz',
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
    duration: "30 min",
    category: "krasa"
  },
  {
    id: 2,
    title: "Masáž plosek nohou s peelingem",
    description: "Osvěžující péče o vaše chodidla spojená s jemným peelingem.",
    price: "600 Kč",
    duration: "30 min",
    category: "krasa"
  },
  {
    id: 3,
    title: "Liftingová masáž obličeje a Gua Sha",
    description: "Omlazující masáž obličeje pomocí tradiční techniky Gua Sha pro prokrvení a vypnutí pleti.",
    price: "1000 Kč",
    duration: "60 min",
    category: "krasa"
  },
  {
    id: 4,
    title: "Hloubková masáž pro svalové uvolnění",
    description: "Cílená masáž pro uvolnění ztuhlých svalů a odstranění napětí.",
    price: "700 Kč",
    duration: "30 min",
    category: "uvolneni"
  },
  {
    id: 5,
    title: "Hloubková aromatická relaxační masáž",
    description: "Hloubková relaxační masáž s využitím aromaterapie pro harmonizaci těla i duše.",
    price: "1000 Kč",
    duration: "60 min",
    category: "uvolneni"
  },
  {
    id: 51,
    title: "Hloubková aromatická relaxační masáž",
    description: "Hloubková relaxační masáž s využitím aromaterapie. Délka 90 min obsahuje navíc masáž hlavy a obličeje.",
    price: "1500 Kč",
    duration: "90 min",
    category: "uvolneni"
  },
  {
    id: 6,
    title: "Maderoterapie (tvarování postavy a lymfa)",
    description: "Masáž stimulující lymfatický systém. Pomáhá tvarovat postavu, redukovat celulitidu pomocí speciálních technik a dřevěných nástrojů.",
    price: "1000 Kč",
    duration: "60 min",
    category: "krasa"
  },
  {
    id: 7,
    title: "Jemná dětská masáž",
    description: "Jemná a uklidňující masáž přizpůsobená dětskému tělu.",
    price: "400 Kč",
    duration: "20 min",
    category: "jemna"
  },
  {
    id: 8,
    title: "Uvolňující masáž pro dospívající (teenage)",
    description: "Masáž pro dospívající, pomáhá při růstových bolestech a uvolnění od celkového stresu.",
    price: "600 Kč",
    duration: "40 min",
    category: "jemna"
  },
  {
    id: 9,
    title: "Pečující těhotenská masáž",
    description: "Speciální jemná masáž pro nastávající maminky (od 4. měsíce těhotenství).",
    price: "800 Kč",
    duration: "40 min",
    category: "jemna"
  },
  {
    id: 10,
    title: "Maderoterapie & Gua Sha (Okamžitá LEHKOST těla i tváře)",
    description: "Okamžitá LEHKOST těla i tváře. Silná kombinace maderoterapie a masáže Gua Sha, která nastartuje tělo i pleť: viditelné tvarování, lifting, aktivace lymfy, odvod přebytečné vody, ruční lymfomodeling, masáž dřevěnými prvky a jadeitovými destičkami pro štíhlejší kontury a redukci otoků.",
    price: "1900 Kč",
    duration: "120 min",
    category: "specialni"
  },
  {
    id: 11,
    title: "Rozjasňující rituál pro unavenou tvář a mysl",
    description: "Reset, který uvidíš i ucítíš. Dopřej si péči, která tě zastaví a zároveň rozzáří: šetrné odlíčení, výživná pleťová maska, ruční masáž obličeje a hlavy pro uvolnění od stresu a masáž jadeitovými destičkami pro redukci otoků a svěží vzhled. Pleť je pak viditelně jasnější, hladší a odpočatá.",
    price: "1200 Kč",
    duration: "60 min",
    category: "specialni"
  },
  {
    id: 14,
    title: "Uvolňující rituál pro lehkost nohou a svěží tvář",
    description: "Jemný peeling nohou, masáž plosek výživným bylinným balzámem, masáž hlavy, šetrné odlíčení pleti s ruční masáží obličeje a závěrečné ošetření guasha jadeitovými destičkami pro vyhlazení a svěží vzhled.",
    price: "1200 Kč",
    duration: "60 min",
    category: "specialni"
  },
  {
    id: 15,
    title: "Hřejivý moxa rituál pro břicho a ženskou pohodu",
    description: "Hřejivé moxování oblasti břicha pro hluboké uvolnění a prohřátí, podpora komfortu před menstruací i během ní, uvolnění napětí. Jemné teplo, které proniká do hloubky a navrací tělu pocit klidu a rovnováhy.",
    price: "700 Kč",
    duration: "30 min",
    category: "specialni"
  },
  {
    id: 16,
    title: "Sportovní regenerační masáž",
    description: "Cílená péče pro unavené a přetížené tělo. Kombinace sportovní masáže, protažení a baněk pomáhá uvolnit napětí, obnovit lehkost pohybu a vrátit tělu energii.",
    price: "800 Kč",
    duration: "30 min",
    category: "specialni"
  },
  {
    id: 17,
    title: "Sportovní regenerační masáž",
    description: "Cílená péče pro unavené a přetížené tělo. Kombinace sportovní masáže, protažení a baněk pomáhá uvolnit napětí, obnovit lehkost pohybu a vrátit tělu energii.",
    price: "1500 Kč",
    duration: "60 min",
    category: "specialni"
  },
  {
    id: 12,
    title: "Baňkování (Doplňková služba)",
    description: "Baňkování využívá podtlak pomocí baněk, které se přikládají na potřebná místa. Ošetření uvolňuje svaly, podporuje prokrvení a regeneraci. Po terapii se cítíte uvolněně, na kůži mohou být dočasné stopy.",
    price: "200 Kč",
    duration: "15 minut",
    category: "doplnkove"
  },
  {
    id: 13,
    title: "Moxa – nedýmivá (Doplňková služba)",
    description: "Jemná zahřívací technika z tradiční čínské medicíny. Moxa prohřívá akupunkturní body, podporuje energii a harmonii těla. Přináší pocit tepla, klidu a celkového uvolnění. Vhodné i při silné menses, k uvolnění břišních bodů.",
    price: "200 Kč",
    duration: "15 minut",
    category: "doplnkove"
  }
];
