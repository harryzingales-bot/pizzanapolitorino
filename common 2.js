/* Pizza Napoli · dati e funzioni condivise dalle bozze
   Per cambiare menù, prezzi, orari o pizze speciali basta modificare questo file. */
const INFO = {
  nome: "Pizza Napoli",
  indirizzo: "Via Frejus 127/A, 10139 Torino",
  tel: "345 681 1577", telNum: "+393456811577",
  wa: "345 681 1577", waNum: "393456811577",
  waGiorni: [1, 2, 3, 4], // WhatsApp solo dal lunedì al giovedì; venerdì, sabato e domenica solo per telefono
  maps: "https://www.google.com/maps/search/?api=1&query=Pizza+Napoli+Via+Frejus+127%2FA+Torino&query_place_id=ChIJ9yak4kdtiEcRpXrp-svs3GU",
  instagram: "https://www.instagram.com/pizzanapoli_via_frejus_127a/", igNome: "@pizzanapoli_via_frejus_127a",
  ragioneSociale: "Pizza Napoli", piva: "13004170018",      // DA INSERIRE: compaiono nel footer
  voto: "4,9", nRecensioni: 278,
  chiuso: [],                        // giorni di chiusura settimanale (0 = domenica): nessuno
  ferie: [],                         // chiusure straordinarie, es. ["2026-12-25"]
  // orari per giorno: tutte le sere 18–23, venerdì, sabato e domenica fino alle 23:30
  orari: d => [18 * 60, [5, 6, 0].includes(d) ? 23 * 60 + 30 : 23 * 60],
  consegnaDiretta: true,
  // consegna: il locale e le fasce di prezzo per distanza (DA CONFERMARE con Badr)
  pos: [45.0697726, 7.6382951],
  zone: [{ km: 2, costo: 2 }, { km: 4, costo: 3 }, { km: 99, costo: 4 }]
};
// distanza in linea d'aria (km) dal locale e fascia di consegna
function kmDa(lat, lng) {
  const R = 6371, r = x => x * Math.PI / 180, [a, b] = INFO.pos;
  const dl = r(lat - a), dg = r(lng - b);
  const h = Math.sin(dl / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(lat)) * Math.sin(dg / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const zonaPer = km => INFO.zone.find(z => km <= z.km) || null;
// quartieri principali (centro indicativo) per scegliere la zona senza indirizzo
const QUARTIERI = [
  ["Borgo San Paolo", 45.0628, 7.6395], ["Cenisia", 45.0722, 7.6490], ["Pozzo Strada", 45.0660, 7.6175],
  ["Cit Turin", 45.0748, 7.6640], ["Campidoglio", 45.0800, 7.6560], ["Parella", 45.0845, 7.6250],
  ["San Donato", 45.0815, 7.6660], ["Santa Rita", 45.0460, 7.6385], ["Crocetta", 45.0590, 7.6675],
  ["Mirafiori Nord", 45.0385, 7.6270], ["San Salvario", 45.0560, 7.6800], ["Centro (Piazza Castello)", 45.0711, 7.6858],
  ["Porta Nuova", 45.0621, 7.6786], ["Porta Susa", 45.0716, 7.6650], ["Vanchiglia", 45.0705, 7.6990], ["Aurora", 45.0850, 7.6850]
].map(([n, lat, lng]) => ({ n, lat, lng, km: kmDa(lat, lng) })).sort((a, b) => a.km - b.km);

// v = vegetariana · img = nome della foto · t = condimenti per il disegno di riserva
const MENU = [
  { id: "maesta", n: "Sua Maestà", sub: "Le margherite", items: [
    { id: "margherita-dop", n: "Margherita DOP", p: 7, d: "salsa di pomodoro, fiordilatte di Agerola, basilico, olio EVO", v: 1, img: "pizza-margherita-dop", t: { base: "r", cheese: 7, top: [["basil", 5]] } },
    { id: "che-bufala", n: "Che Bufala", p: 9, d: "salsa di pomodoro, mozzarella di bufala, basilico, olio EVO", v: 1, img: "pizza-che-bufala", t: { base: "r", cheese: 5, big: 1, top: [["basil", 5]] } },
    { id: "margherita-special", n: "Margherita Special", p: 10, d: "salsa di pomodoro, provola affumicata, pancetta al pepe, stracciatella di burrata, basilico, olio EVO", img: "pizza-margherita-special", t: { base: "r", cheese: 4, top: [["provola", 6], ["pancetta", 7], ["straccia", 5], ["basil", 4]] } }
  ]},
  { id: "pizze", n: "Le Pizze", sub: "Le classiche della casa", items: [
    { id: "marinara", n: "Marinara di Napoli", p: 5.5, d: "pomodoro, aglio, basilico, pecorino romano, olio EVO", v: 1, img: "pizza-marinara", t: { base: "r", cheese: 0, top: [["garlic", 12], ["basil", 4]] } },
    { id: "napoli", n: "Napoli", p: 8, d: "pomodoro, alici di Cetara, fiordilatte di Agerola, origano, basilico, olio EVO", img: "pizza-napoli", t: { base: "r", cheese: 6, top: [["alici", 7], ["basil", 3]] } },
    { id: "tradizionale", n: "Tradizionale", p: 8, d: "fiordilatte, friarielli saltati con aglio, salsiccia, olio EVO", img: "pizza-tradizionale", t: { base: "w", cheese: 6, top: [["friarielli", 9], ["salsiccia", 12]] } },
    { id: "champions", n: "La Champions", p: 9, d: "salsa di pomodoro, fiordilatte, 'nduja, salamino piccante, cipolla rossa", img: "pizza-champions", t: { base: "r", cheese: 6, top: [["salamino", 9], ["nduja", 6], ["cipolla", 6]] } },
    { id: "amalfi", img: "pizza-amalfi", n: "Amalfi", p: 9, d: "filetti di tonno, fiordilatte di Agerola, provola affumicata, pomodori gialli, tarallo napoletano sbriciolato, olio EVO", t: { base: "w", cheese: 6, top: [["tonno", 8], ["giallo", 8], ["tarallo", 18]] } },
    { id: "regina", img: "pizza-regina", n: "La Regina", p: 10, d: "salsa di pomodoro, pomodorini rossi, burrata, basilico, olio EVO", v: 1, t: { base: "r", cheese: 0, burrata: 1, top: [["pomodorino", 9], ["basil", 4]] } },
    { id: "vesuviana", img: "pizza-vesuviana", n: "Vesuviana", p: 10, d: "scarola riccia, olive taggiasche, acciughe, pomodori secchi, ciliegina di bufala DOP", t: { base: "w", cheese: 0, top: [["scarola", 9], ["oliva", 9], ["alici", 5], ["secco", 6], ["bufala", 5]] } },
    { id: "formaggi-special", img: "pizza-formaggi-special", n: "Formaggi Special", p: 10, d: "crema di parmigiano 16 mesi, blu di pecora, provola affumicata, fiordilatte, miele, nocciola Piemonte, olio EVO", v: 1, t: { base: "w", cheese: 7, top: [["blu", 8], ["provola", 6], ["nocciola", 14], ["miele", 1]] } },
    { id: "chic", img: "pizza-chic", n: "La Chic", p: 10, d: "pesto genovese, mozzarella, pomodorini, stracciatella fiordilatte", v: 1, t: { base: "g", cheese: 4, top: [["pomodorino", 8], ["straccia", 6]] } },
    { id: "toscanella", n: "Toscanella", p: 10, d: "salsa di pomodoro, soppressata toscana, cipolle di Tropea caramellate, pomodorini confit, stracciatella, olio EVO", img: "pizza-toscanella", t: { base: "r", cheese: 3, top: [["soppressata", 8], ["cipolla", 7], ["pomodorino", 6], ["straccia", 5]] } },
    { id: "pistacchiosa", n: "Pistacchiosa", p: 10, d: "fiordilatte, pesto di pistacchio, burrata 200 g, mortadella al pistacchio, granella di pistacchio", img: "pizza-pistacchiosa", t: { base: "w", cheese: 5, burrata: 1, top: [["mortadella", 6], ["pesto", 7], ["granella", 24]] } },
    { id: "deliziosa", img: "pizza-deliziosa", n: "Deliziosa", p: 10, d: "salsa di pomodoro, fiordilatte, funghi, pancetta coppata, brie", t: { base: "r", cheese: 5, top: [["funghi", 9], ["pancetta", 6], ["brie", 5]] } }
  ]},
  { id: "novita", n: "Novità", sub: "Le ultime nate", items: [
    { id: "lory", n: "Lory", p: 12, d: "fiordilatte, provola affumicata, pomodorini confit, pancetta coppata (fuori cottura), stracciatella, pesto di basilico, olio EVO", img: "pizza-lory", t: { base: "w", cheese: 5, top: [["provola", 5], ["pomodorino", 7], ["pancetta", 7], ["straccia", 5], ["pesto", 6]] } },
    { id: "romana", n: "La Romana", p: 12, d: "fiordilatte, provola affumicata, gorgonzola DOP (fuori cottura), guanciale amatriciana, cipolla caramellata, bocconcini di bufala, basilico, olio EVO", img: "pizza-romana", t: { base: "w", cheese: 5, top: [["guanciale", 9], ["cipolla", 6], ["blu", 6], ["bufala", 5], ["basil", 3]] } },
    { id: "zuccotta", n: "Zuccotta Special", p: 12, d: "crema di zucca, fiordilatte, provola affumicata, salsiccia, stracciatella (fuori forno), tarallo sbriciolato", img: "pizza-zuccotta", t: { base: "w", cheese: 5, burrata: 1, top: [["salsiccia", 10], ["basil", 4]] } },
    { id: "sorrentina", n: "Sorrentina", p: 12, d: "salsa di pomodoro, fiordilatte, provola affumicata, rucola, stracciatella, scaglie di grana", img: "pizza-sorrentina", t: { base: "r", cheese: 4, top: [["provola", 5], ["straccia", 5]] } },
    { id: "casertana", n: "Casertana", p: 12, d: "crema di parmigiano reggiano, fiordilatte, provola affumicata, salsiccia, prezzemolo, paprika affumicata", img: "pizza-casertana", t: { base: "w", cheese: 5, top: [["provola", 5], ["salsiccia", 12]] } },
    { id: "ischitana", n: "Ischitana", p: 10, d: "salsa di pomodoro, fiordilatte, provola affumicata, pomodorini rossi conditi, filetti di tonno (fuori cottura), cipolla caramellata, ciliegina di bufala", t: { base: "r", cheese: 5, top: [["provola", 4], ["pomodorino", 8], ["tonno", 8], ["cipolla", 6], ["bufala", 4]] } }
  ]},
  // prezzi dal volantino: birre 4 €, bibite 3 € (DA CONFERMARE con Badr per ogni bevanda; acqua da definire)
  { id: "birre", n: "Birre", sub: "Tutte a 4 €, anche da 66 cl", items: [
    { id: "peroni", n: "Peroni", p: 4, d: "lager italiana", img: "birra-peroni", drink: 1, beer: 1 },
    { id: "poretti", n: "Poretti Tre Luppoli", p: 4, d: "lager equilibrata e profumata", img: "birra-poretti", drink: 1, beer: 1 },
    { id: "ichnusa", n: "Ichnusa Non Filtrata", p: 4, d: "birra sarda non filtrata", img: "birra-ichnusa", drink: 1, beer: 1 },
    { id: "messina", n: "Messina Cristalli di Sale", p: 4, d: "con sale marino di Sicilia", img: "birra-messina", drink: 1, beer: 1 },
    { id: "menabrea", n: "Menabrea Bionda", p: 4, d: "bionda piemontese, Biella", img: "birra-menabrea", drink: 1, beer: 1 },
    { id: "leffe", n: "Leffe Blonde", p: 4, d: "birra d'abbazia belga, 33 cl", img: "birra-leffe", drink: 1, beer: 1 },
    { id: "peroni-66", n: "Peroni 66 cl", p: 4, d: "bottiglia grande da 66 cl", img: "birra-peroni", drink: 1, beer: 1 },
    { id: "poretti-66", n: "Poretti Tre Luppoli 66 cl", p: 4, d: "bottiglia grande da 66 cl", img: "birra-poretti", drink: 1, beer: 1 },
    { id: "raffo", n: "Raffo Grezza", p: 4, d: "non filtrata, con cereali di Puglia", img: "birra-raffo", drink: 1, beer: 1 }
  ]},
  { id: "bevande", n: "Bibite e acqua", sub: "Bibite in vetro e in lattina", items: [
    { id: "coca", n: "Coca-Cola", p: 3, d: "in vetro", img: "coca-cola", drink: 1 },
    { id: "coca-zero", n: "Coca-Cola Zero", p: 3, d: "in vetro, zero zuccheri", img: "coca-cola-zero", drink: 1 },
    { id: "fanta", n: "Fanta", p: 3, d: "in lattina", img: "fanta", drink: 1 },
    { id: "pepsi", n: "Pepsi", p: 3, d: "in lattina", img: "pepsi", drink: 1 },
    { id: "chinotto", n: "Lurisia Chinotto", p: 3, d: "con chinotto di Savona", img: "lurisia-chinotto", drink: 1 },
    { id: "aranciata", n: "Lurisia Aranciata", p: 3, d: "con arance del Gargano", img: "lurisia-aranciata", drink: 1 },
    { id: "acqua-nat", n: "Acqua naturale", p: 1.5, d: "Guizza, 0,5 L", img: "acqua-naturale", drink: 1 },
    { id: "acqua-friz", n: "Acqua frizzante", p: 1.5, d: "Guizza, 0,5 L", img: "acqua-frizzante", drink: 1 }
  ]}
];
// allergeni evidenti: su tutte le pizze glutine e latte, più questi
// allergeni secondo il Reg. UE 1169/2011 (numerazione ufficiale 1–14)
const ALLERGENI = { 1: "Cereali con glutine", 2: "Crostacei", 3: "Uova", 4: "Pesce", 5: "Arachidi", 6: "Soia", 7: "Latte e lattosio", 8: "Frutta a guscio", 9: "Sedano", 10: "Senape", 11: "Sesamo", 12: "Solfiti", 13: "Lupini", 14: "Molluschi" };
// allergeni evidenti: tutte le pizze 1 (glutine) e 7 (latte), più questi
const ALLERGENI_EXTRA = { napoli: [4], vesuviana: [4], ischitana: [4], amalfi: [4, 8], pistacchiosa: [8], "formaggi-special": [8] };
MENU.forEach(c => c.items.forEach(i => { i.al = i.beer ? [1] : i.drink ? [] : [1, 7, ...(ALLERGENI_EXTRA[i.id] || [])].sort((x, y) => x - y); }));
const alBadges = al => al && al.length ? `<span class="alb" aria-label="Allergeni: ${al.map(n => ALLERGENI[n]).join(", ")}">${al.map(n => `<i title="${ALLERGENI[n]}">${n}</i>`).join("")}</span>` : "";
const ALL_ITEMS = MENU.flatMap(c => c.items.map(i => ({ ...i, cat: c.id })));
const findItem = id => ALL_ITEMS.find(i => i.id === id) || (id === COMPONI.id ? COMPONI : null);

// Componi la tua pizza (come su Glovo): base a 7 € + ingredienti (prezzi dallo scontrino di Badr, 26 nov 2026)
const COMPONI = { id: "componi", n: "Componi la tua pizza", p: 7, al: [1, 7],
  basi: [{ id: "margherita", n: "Margherita", d: "pomodoro e fiordilatte" }, { id: "rossa", n: "Rossa", d: "solo pomodoro" }, { id: "bianca", n: "Bianca", d: "fiordilatte, senza pomodoro" }],
  gruppi: [
    { n: "Formaggi", ingr: [["Mozzarella", 1], ["Bufala", 2], ["Burrata", 3], ["Stracciatella", 3], ["Scamorza", 1], ["Gorgonzola", 1], ["Parmigiano", 1]] },
    { n: "Salumi e carne", ingr: [["Prosciutto cotto", 1], ["Prosciutto crudo", 3], ["Salame piccante", 1], ["Salsiccia", 1], ["Wurstel", 1], ["Pancetta", 1], ["Mortadella", 1], ["'Nduja", 1]] },
    { n: "Verdure", ingr: [["Funghi", 1], ["Patate", 1], ["Pomodorini", 1], ["Pomodorini confit", 1], ["Pomodori secchi", 1], ["Rucola", 1], ["Friarielli", 1], ["Scarola", 1], ["Cipolla", 1], ["Cipolla caramellata", 1], ["Peperoni", 1], ["Melanzane", 1], ["Melanzane grigliate", 1], ["Zucchine", 1], ["Zucchine grigliate", 1], ["Carciofi", 1], ["Olive", 1]] },
    { n: "Dal mare", ingr: [["Acciughe", 1], ["Tonno", 1]] },
    { n: "Extra", ingr: [["Pesto", 1], ["Pistacchio", 1], ["Noci", 1], ["Sugo di pomodoro", 1], ["Aglio", 1]] }
  ] };
const waOggi = (d = new Date()) => INFO.waGiorni.includes(d.getDay());

// Le 3 pizze speciali a rotazione: cambiare solo id e frase
const SPECIALI = [
  { id: "lory", tag: "La più nuova", frase: "Nata quasi per caso al banco: pancetta coppata messa a crudo appena sfornata, stracciatella e pesto di basilico." },
  { id: "romana", tag: "Omaggio a Roma", frase: "Guanciale all'amatriciana e gorgonzola DOP a crudo: Napoli che strizza l'occhio a Roma." },
  { id: "zuccotta", tag: "Di stagione", frase: "Crema di zucca, provola affumicata e salsiccia; stracciatella fuori forno e tarallo sbriciolato." }
];

const OFFERTA = { titolo: "Lory + bibita in vetro", prezzo: 12, quando: "Dal lunedì al giovedì", nota: "Coca-Cola in vetro inclusa" };

// Recensioni Google (tradotte dall'inglese, accorciate)
const REVIEWS = [
  "Impasto morbido e croccante allo stesso tempo, ingredienti di qualità e personale gentilissimo. Una delle migliori pizzerie di Torino.",
  "La Toscanella è da 10! Al telefono ho chiesto di toglierla carne e di tagliarla a spicchi: gentilissimi, e parlano anche inglese.",
  "Trovata per caso durante un viaggio in moto: una vera pizza che profuma d'Italia, e a meno di 10 euro.",
  "Non potete immaginare il profumo di questa pizza con il fior di latte. Dovete provarla."
].map(t => t.replace("toglierla carne", "togliere la carne"));

/* ---------- utilità ---------- */
const euro = n => n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const prezzo = n => n == null ? "prezzo da definire" : Number.isInteger(n) ? n + " €" : euro(n);
const hhmm = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
const waLink = txt => "https://wa.me/" + INFO.waNum + (txt ? "?text=" + encodeURIComponent(txt) : "");
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

const chiusoIl = d => INFO.chiuso.includes(d.getDay()) || INFO.ferie.includes(d.toISOString().slice(0, 10));
function openStatus(now = new Date()) {
  const m = now.getHours() * 60 + now.getMinutes();
  if (!chiusoIl(now)) { const [a, b] = INFO.orari(now.getDay()); if (m >= a && m < b) {
    const left = b - m;
    return { open: true, short: "Aperto ora", long: left <= 60 ? `Aperto · chiude tra ${left} min` : `Aperto · fino alle ${hhmm(b)}` };
  } }
  for (let k = 0; k < 15; k++) {
    const d = new Date(now); d.setDate(now.getDate() + k);
    if (chiusoIl(d)) continue;
    const [a] = INFO.orari(d.getDay()); if (k === 0 && m >= a) continue;
    const quando = k === 0 ? "oggi" : k === 1 ? "domani" : GIORNI[d.getDay()];
    return { open: false, short: "Chiuso ora", long: `Chiuso · apre ${quando} alle ${hhmm(a)}` };
  }
  return { open: false, short: "Chiuso", long: "Chiuso" };
}
// orari di ritiro o consegna: oggi (da adesso + 30 min) oppure il prossimo giorno di apertura; ultimo orario 15 min prima della chiusura
function pickupSlots(step = 15, lead = 30) {
  const now = new Date();
  for (let k = 0; k < 15; k++) {
    const d = new Date(now); d.setDate(now.getDate() + k);
    if (chiusoIl(d)) continue;
    const min = k === 0 ? now.getHours() * 60 + now.getMinutes() + lead : 0;
    const [a, b] = INFO.orari(d.getDay()), out = [];
    for (let t = a + 15; t <= b - 15; t += step) if (t >= min) out.push(hhmm(t));
    if (out.length) return { giorno: k === 0 ? "oggi" : k === 1 ? "domani" : GIORNI[d.getDay()], slots: out };
  }
  return { giorno: "", slots: [] };
}
function orariTesto() { return "Tutte le sere 18:00–23:00 · venerdì, sabato e domenica fino alle 23:30"; }

/* ---------- foto: se manca il file in img/, compare il disegno di riserva ---------- */
function setupPhotos(root = document) {
  $$("[data-img]", root).forEach(el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const name = el.dataset.img, it = el.dataset.pizza ? findItem(el.dataset.pizza) : null;
    const img = new Image();
    img.alt = el.dataset.alt || "";
    img.onload = () => { el.classList.add("has-photo"); el.prepend(img); };
    img.onerror = () => {
      el.classList.add("no-photo");
      if (it && it.t) el.insertAdjacentHTML("afterbegin", pizzaSVG(it.id, it.t));
      else el.insertAdjacentHTML("afterbegin", `<div class="ph-miss"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg><span>Foto: ${name}.jpg</span>${el.dataset.alt ? `<small>${el.dataset.alt}</small>` : ""}</div>`);
    };
    img.src = "img/" + name + ".jpg";
  });
}

/* ---------- disegno della pizza dall'alto (segnaposto finché non arrivano le foto) ---------- */
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const TOP = {
  basil: (x, y, r, a) => `<path d="M${x} ${y}c6-9 16-9 20 0c-6 7-15 7-20 0z" fill="#3E7A2C" transform="rotate(${a} ${x + 10} ${y})"/><path d="M${x + 2} ${y}h16" stroke="#2C5A1E" stroke-width=".8" transform="rotate(${a} ${x + 10} ${y})"/>`,
  garlic: (x, y, r, a) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="1.6" fill="#F6EBD3" transform="rotate(${a} ${x} ${y})"/>`,
  alici: (x, y, r, a) => `<path d="M${x - 11} ${y}q11-4 22 0q-11 4-22 0z" fill="#8C6A57" stroke="#6E4E3E" stroke-width=".6" transform="rotate(${a} ${x} ${y})"/>`,
  friarielli: (x, y, r, a) => `<path d="M${x} ${y}c5-8 14-6 13 2c-4 6-11 5-13-2z" fill="#3B5E25" transform="rotate(${a} ${x} ${y})"/>`,
  scarola: (x, y, r, a) => `<path d="M${x} ${y}c4-9 15-7 14 1c-3 3-6 1-7 4c-3 1-6-1-7-5z" fill="#7FA046" transform="rotate(${a} ${x} ${y})"/>`,
  salsiccia: (x, y) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#9A5A3C"/><circle cx="${x - 1}" cy="${y - 1}" r="1.6" fill="#B8774F"/>`,
  salamino: (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#B5412F"/><circle cx="${x - 3}" cy="${y - 2}" r="1.4" fill="#E9B7A4"/><circle cx="${x + 3}" cy="${y + 2}" r="1.2" fill="#E9B7A4"/>`,
  soppressata: (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#A9423F"/><circle cx="${x + 2}" cy="${y - 3}" r="1.5" fill="#EBC4B8"/><circle cx="${x - 3}" cy="${y + 2}" r="1.3" fill="#EBC4B8"/>`,
  nduja: (x, y) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#B02C17"/>`,
  cipolla: (x, y, r, a) => `<path d="M${x - 8} ${y}a8 8 0 0 1 16 0" fill="none" stroke="#9C4A7E" stroke-width="2.2" transform="rotate(${a} ${x} ${y})"/>`,
  tonno: (x, y, r, a) => `<path d="M${x - 6} ${y - 3}l9-2 4 6-8 3z" fill="#C8A07B" transform="rotate(${a} ${x} ${y})"/>`,
  giallo: (x, y) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#F2BE2C"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.5" fill="#FBE08A"/>`,
  pomodorino: (x, y) => `<circle cx="${x}" cy="${y}" r="5.6" fill="#D9372A"/><circle cx="${x - 1.6}" cy="${y - 1.6}" r="1.6" fill="#F07A64"/>`,
  secco: (x, y, r, a) => `<path d="M${x - 5} ${y}c2-5 8-5 10 0c-2 4-8 4-10 0z" fill="#8E2417" transform="rotate(${a} ${x} ${y})"/>`,
  oliva: (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#3A2B2B"/><circle cx="${x}" cy="${y}" r="1.1" fill="#6B4E45"/>`,
  tarallo: (x, y) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#D9AE6E"/>`,
  granella: (x, y) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#8DA63A"/>`,
  nocciola: (x, y) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#9A6635"/>`,
  blu: (x, y) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#EFE9D6"/><circle cx="${x + 1}" cy="${y}" r="1.4" fill="#5E7B92"/><circle cx="${x - 2}" cy="${y - 2}" r="1" fill="#5E7B92"/>`,
  provola: (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#E7BE73" opacity=".9"/>`,
  brie: (x, y, r, a) => `<path d="M${x} ${y}l10-4 0 8z" fill="#F4E8C4" stroke="#E2CD95" transform="rotate(${a} ${x} ${y})"/>`,
  pancetta: (x, y, r, a) => `<path d="M${x - 10} ${y - 3}q10-4 20 0l0 5q-10-4-20 0z" fill="#E09A8C" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 9} ${y}q9-3 18 0" stroke="#F6DAD2" stroke-width="1.2" fill="none" transform="rotate(${a} ${x} ${y})"/>`,
  guanciale: (x, y, r, a) => `<rect x="${x - 6}" y="${y - 3}" width="12" height="6" rx="1.5" fill="#E3B6A2" transform="rotate(${a} ${x} ${y})"/><rect x="${x - 6}" y="${y - 3}" width="12" height="2" fill="#B9705B" transform="rotate(${a} ${x} ${y})"/>`,
  mortadella: (x, y, r, a) => `<path d="M${x - 14} ${y}q14-12 28 0q-14 10-28 0z" fill="#EDAFAB" transform="rotate(${a} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="1.4" fill="#8DA63A"/>`,
  pesto: (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#5E8A2B" opacity=".92"/>`,
  funghi: (x, y, r, a) => `<path d="M${x - 6} ${y}a6 5 0 0 1 12 0z" fill="#C4A27D" transform="rotate(${a} ${x} ${y})"/><rect x="${x - 1.6}" y="${y}" width="3.2" height="5" fill="#E3CFB1" transform="rotate(${a} ${x} ${y})"/>`,
  straccia: (x, y) => `<path d="M${x - 8} ${y}c2-7 13-7 15-1c1 6-10 9-15 1z" fill="#FFFDF6" stroke="#EFE6D1" stroke-width=".8"/>`,
  bufala: (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#FFFDF7" stroke="#EDE3CE" stroke-width=".8"/>`,
  miele: (x, y) => `<path d="M60 70q30 20 50 0t40 10M70 130q30-20 60 5" fill="none" stroke="#E8A929" stroke-width="2.2" opacity=".8"/>`
};
function pizzaSVG(seed, t) {
  const R = rng(seed);
  const sauce = { r: "#C8432A", w: "#F2E4C4", g: "#6E9431" }[t.base || "r"];
  const pt = (maxR = 66) => { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * maxR; return [100 + Math.cos(a) * d, 100 + Math.sin(a) * d]; };
  let s = `<svg class="pizza-svg" viewBox="0 0 200 200" role="img" aria-label="Disegno della pizza"><defs><radialGradient id="cr-${seed}" cx=".5" cy=".5" r=".5"><stop offset=".82" stop-color="#E7B46A"/><stop offset=".95" stop-color="#C98B43"/><stop offset="1" stop-color="#A86C33"/></radialGradient></defs>`;
  s += `<circle cx="100" cy="100" r="97" fill="url(#cr-${seed})"/>`;
  for (let i = 0; i < 14; i++) { const a = R() * Math.PI * 2, d = 86 + R() * 8; s += `<ellipse cx="${100 + Math.cos(a) * d}" cy="${100 + Math.sin(a) * d}" rx="${3 + R() * 5}" ry="${2 + R() * 3}" fill="#4A2A16" opacity="${.35 + R() * .4}" transform="rotate(${a * 57} ${100 + Math.cos(a) * d} ${100 + Math.sin(a) * d})"/>`; }
  s += `<path d="${blob(R, 100, 100, 78, 14)}" fill="${sauce}"/>`;
  for (let i = 0; i < (t.cheese || 0); i++) { const [x, y] = pt(58); s += `<path d="${blob(R, x, y, (t.big ? 17 : 12) + R() * 6, 7)}" fill="#FBF3DF" opacity=".96"/>`; }
  if (t.burrata) s += `<path d="${blob(R, 100, 100, 26, 10)}" fill="#FFFDF8" stroke="#EADFC8"/><path d="${blob(R, 98, 97, 12, 7)}" fill="#F5EEDD"/>`;
  (t.top || []).forEach(([k, n]) => { for (let i = 0; i < n; i++) { const [x, y] = pt(k === "granella" || k === "tarallo" ? 70 : 62); s += TOP[k](x.toFixed(1), y.toFixed(1), 0, Math.round(R() * 360)); } });
  return s + `</svg>`;
}
function blob(R, cx, cy, r, n) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (.86 + R() * .24); p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  let d = `M${((p[0][0] + p[n - 1][0]) / 2).toFixed(1)} ${((p[0][1] + p[n - 1][1]) / 2).toFixed(1)}`;
  for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; d += `Q${a[0].toFixed(1)} ${a[1].toFixed(1)} ${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`; }
  return d + "Z";
}

/* ---------- ordine semplice (fascia 150 €) ---------- */
function simpleOrderMessage(o) {
  return [`Ciao Pizza Napoli! Vorrei ordinare da asporto:`, ``, o.ordine || "(scrivo qui cosa ordino)", ``,
    o.orario ? `Ritiro: ${o.giorno} alle ${o.orario}` : null, o.nome ? `Nome: ${o.nome}` : null].filter(x => x !== null).join("\n").replace(/\n{3,}/g, "\n\n");
}

/* ---------- carrello (fascia 200 €) ---------- */
const Cart = {
  lines: [], subs: [],
  on(f) { this.subs.push(f); },
  emit() { this.subs.forEach(f => f(this)); },
  add(id, extra, p) {
    const it = findItem(id); if (!it || it.p == null) return false;
    const key = id + (extra ? ":" + extra.join(",") : "");
    const same = this.lines.find(l => l.key === key);
    if (same) same.qty++; else this.lines.push({ key, id, qty: 1, extra: extra || null, p: p == null ? null : p });
    this.emit(); return true;
  },
  consegna: null, // { costo, zona } se il cliente sceglie la consegna
  set(key, qty) { const l = this.lines.find(x => x.key === key); if (!l) return; l.qty = qty; if (qty <= 0) this.lines = this.lines.filter(x => x !== l); this.emit(); },
  count() { return this.lines.reduce((s, l) => s + l.qty, 0); },
  unit(l) { return l.p != null ? l.p : findItem(l.id).p; },
  lineTotal(l) { return this.unit(l) * l.qty; },
  subtotal() { return this.lines.reduce((s, l) => s + this.lineTotal(l), 0); },
  total() { return this.subtotal() + (this.consegna && this.consegna.costo ? this.consegna.costo : 0); },
  label(l) { const it = findItem(l.id); return it.n + (l.extra ? ` (${l.extra.join(", ").toLowerCase()})` : ""); },
  message(o) {
    const dom = o.modo === "consegna", c = this.consegna;
    return [`Ciao Pizza Napoli! Vorrei ordinare ${dom ? "con consegna a domicilio" : "da asporto"}:`, ``,
      ...this.lines.map(l => `• ${l.qty} × ${this.label(l)} – ${euro(this.lineTotal(l))}`), ``,
      dom ? `Consegna: ${c && c.costo ? euro(c.costo) + (c.zona ? ` (${c.zona})` : "") : "costo da confermare"}` : null,
      dom && o.indirizzo ? `Indirizzo: ${o.indirizzo}` : null,
      `Orario ${dom ? "di consegna" : "di ritiro"}: ${o.orario ? `${o.giorno} alle ${o.orario}` : "appena possibile"}`,
      o.nome ? `Nome: ${o.nome}` : null, o.note ? `Note: ${o.note}` : null, ``,
      `Totale: ${euro(this.total())}`, `Pagamento ${dom ? "alla consegna" : "al ritiro"}`].filter(x => x !== null).join("\n").replace(/\n{3,}/g, "\n\n");
  }
};

/* ---------- comparsa allo scroll (fascia 1) ---------- */
function setupReveal(sel = "[data-reveal]") {
  const els = $$(sel);
  if (reduceMotion() || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .14, rootMargin: "0px 0px -6% 0px" });
  els.forEach(e => io.observe(e));
}
function splitWords(el) {
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) f.append(w); else { const s = document.createElement("span"); s.className = "w"; s.innerHTML = `<span>${w}</span>`; f.append(s); } });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
  });
  walk(el); $$(".w > span", el).forEach((s, i) => s.style.transitionDelay = (i * 70) + "ms");
}
function countUp(el) {
  const end = parseFloat(el.dataset.count.replace(",", ".")), dec = el.dataset.count.includes(",") ? 1 : 0, dur = 1200, t0 = performance.now();
  const fmt = v => dec ? v.toFixed(1).replace(".", ",") : Math.round(v);
  if (reduceMotion()) { el.textContent = fmt(end); el.dataset.counted = 1; return; }
  const f = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = fmt(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); else el.dataset.counted = 1; };
  requestAnimationFrame(f);
}
function setupCounters() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } }), { threshold: .6 });
  $$("[data-count]").forEach(e => io.observe(e));
}
// header: ombra allo scroll + voce attiva
function setupNav() {
  const h = $("header.nav"), links = $$(".links a[href^='#']");
  const secs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  const onS = () => {
    h && h.classList.toggle("scrolled", scrollY > 30);
    let cur = null; secs.forEach(s => { if (s.getBoundingClientRect().top < 140) cur = s.id; });
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  };
  addEventListener("scroll", onS, { passive: true }); onS();
}
function setupStatus() {
  const st = openStatus();
  $$("[data-status]").forEach(el => { el.textContent = st.long; el.closest(".status")?.classList.toggle("closed", !st.open); });
}
const ICON = {
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>`,
  tel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.6 7-12a7 7 0 0 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  scooter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l3-6h-4l-2-4H9M14 7h3"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22c4 0 7-2.7 7-7 0-5-5-7-4-13-3 2-6 5-6 9-1-1-2-2-2-4-1 2-2 4-2 8 0 4.3 3 7 7 7z"/></svg>`
};
// logo: Vesuvio + scritta, ridisegnato dal volantino
const LOGO = (col = "currentColor") => `<svg class="logo-svg" viewBox="0 0 220 74" aria-label="Pizza Napoli" role="img"><g fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="v-line" d="M8 40c10-14 30-30 52-30 10 0 16 6 26 6s18-6 30-6c18 0 30 10 44 22"/><path class="v-line" d="M30 38c10-6 28-8 50-6 24 2 50 4 76 0"/><ellipse cx="22" cy="40" rx="9" ry="6"/><path d="M58 32c4-8 12-8 14 0-4 6-10 6-14 0z" fill="${col}"/></g><text x="110" y="68" text-anchor="middle" font-family="'Josefin Sans',sans-serif" font-size="25" font-weight="600" letter-spacing="1.5" fill="${col}">PIZZA NAPOLI</text></svg>`;

/* ---------- recensioni Google che si aggiornano da sole ----------
   Il file reviews.json viene riscritto ogni notte da GitHub (scripts/aggiorna-recensioni.mjs).
   Se il file manca o non si legge, il sito usa questi dati di riserva. */
const REVIEWS_RISERVA = {
  aggiornato: "2026-11-19", voto: 4.9, totale: 278, link: INFO.maps,
  recensioni: REVIEWS.map(t => ({ autore: "Cliente Google", stelle: 5, testo: t, tradotta: true, quando: "" }))
};
let REVIEW_DATA = REVIEWS_RISERVA;
async function loadReviews() {
  try {
    const r = await fetch("reviews.json", { cache: "no-store" });
    if (!r.ok) throw 0;
    const d = await r.json();
    if (!d.recensioni || !d.recensioni.length) throw 0;
    REVIEW_DATA = d;
  } catch (e) { REVIEW_DATA = REVIEWS_RISERVA; }
  return REVIEW_DATA;
}
const votoTxt = v => Number(v).toFixed(1).replace(".", ",");
function bindReviewStats(d = REVIEW_DATA) {
  $$("[data-voto]").forEach(e => e.textContent = votoTxt(d.voto));
  $$("[data-totale]").forEach(e => e.textContent = d.totale);
  $$("[data-aggiornato]").forEach(e => e.textContent = new Date(d.aggiornato).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }));
  $$("[data-reviews-link]").forEach(a => a.href = d.link || INFO.maps);
  $$("[data-stat]").forEach(e => {
    const v = e.dataset.stat === "voto" ? votoTxt(d.voto) : String(d.totale);
    e.dataset.count = v; if (e.dataset.counted) e.textContent = v;
  });
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// testo della recensione accorciato per le schede
const corta = (t, n = 220) => t.length > n ? t.slice(0, t.lastIndexOf(" ", n)) + "…" : t;
