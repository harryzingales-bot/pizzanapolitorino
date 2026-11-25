/* Pizza Napoli · zone di consegna disegnate sulla mappa (figurative, DA CONFERMARE con Badr)
   Le coordinate sono in pixel dell'immagine img/mappa-zone.jpg (1505 × 809). */
const ZONE = [
  { n: "Zona 1", costo: 2, col: "#F4C431", km: "entro 2 km" },
  { n: "Zona 2", costo: 3, col: "#F08A2B", km: "da 2 a 4 km" },
  { n: "Zona 3", costo: 4, col: "#E0412E", km: "oltre 4 km" }
];
// confini di ogni zona (dall'interno verso l'esterno). Oltre la Zona 3 non si consegna.
const ZONE_BORDI = [
  [[640, 200], [760, 150], [860, 170], [925, 240], [925, 300], [915, 400], [895, 520], [800, 545], [690, 520], [625, 440], [615, 320]],
  [[560, 30], [760, 0], [1130, 0], [1135, 110], [1100, 190], [1110, 300], [1185, 340], [1190, 430], [1170, 560], [1110, 640], [1010, 760], [900, 809], [640, 809], [580, 640], [545, 450], [545, 230]],
  [[520, 0], [1330, 0], [1365, 200], [1350, 460], [1280, 600], [1130, 770], [1000, 809], [600, 809], [520, 620], [505, 380], [515, 150]]
];
const ZONE_BADGE = [[770, 470], [690, 640], [1240, 180]];
const LOCALE_PX = [779, 352];
// quartieri assegnati alla fascia in base alla distanza in linea d'aria dal locale (centro del quartiere)
const QUARTIERI_ZONA = [
  ["Borgo San Paolo", 0], ["Cenisia", 0], ["Pozzo Strada", 0], ["Parella", 0], ["Pellerina", 0], ["Campidoglio", 0],
  ["San Donato", 1], ["Cit Turin", 1], ["Crocetta", 1], ["Santa Rita", 1], ["Mirafiori Nord", 1], ["Lucento", 1], ["Centro", 1], ["San Salvario", 1],
  ["Borgo Vittoria", 1], ["Madonna di Campagna", 1], ["Filadelfia", 1], ["Porta Nuova", 1],
  ["Aurora", 2], ["Vanchiglia", 2], ["Borgo Po", 2], ["Barriera di Milano", 2]
].map(([n, z]) => ({ n, z })).sort((a, b) => a.z - b.z || a.n.localeCompare(b.n, "it"));

function ZoneMap(el, o) {
  const W = 1505, H = 809;
  const pts = p => p.map(q => q.join(",")).join(" ");
  const ring = i => "M" + ZONE_BORDI[i].map(q => q.join(",")).join("L") + "Z";
  let paths = "";
  ZONE.forEach((z, i) => {
    const d = ring(i) + (i ? ring(i - 1) : "");
    paths += `<path class="zm-zone" data-zi="${i}" d="${d}" fill="${z.col}" fill-rule="evenodd"/>`;
  });
  const lines = ZONE_BORDI.map((p, i) => `<polygon class="zm-line" data-zi="${i}" points="${pts(p)}"/>`).join("");
  const badges = ZONE.map((z, i) => `<g class="zm-badge" data-zi="${i}" transform="translate(${ZONE_BADGE[i].join(" ")})"><rect x="-92" y="-28" width="184" height="56" rx="28" fill="${z.col}"/><text y="10" text-anchor="middle">${z.n} · ${z.costo} €</text></g>`).join("");
  const pin = `<g transform="translate(${LOCALE_PX.join(" ")})"><circle r="22" fill="#fff" opacity=".25"/><path d="M0 3c-11-12-17-19-17-26a17 17 0 0 1 34 0c0 7-6 14-17 26z" fill="#E0412E" stroke="#fff" stroke-width="3"/><circle cy="-23" r="6" fill="#fff"/></g>`;
  el.classList.add("zm");
  el.innerHTML = `<div class="zm-stage"><img src="${o.src}" alt="Mappa di Torino con le zone di consegna" draggable="false"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${paths}${lines}${badges}${pin}</svg></div>
    <div class="mm-ctrl"><button type="button" data-z="1" aria-label="Ingrandisci">+</button><button type="button" data-z="-1" aria-label="Riduci">−</button><button type="button" data-home aria-label="Vista iniziale">⌖</button></div>
    <div class="mm-hint" aria-hidden="true"></div><span class="mm-attr">© contributori di OpenStreetMap</span>`;
  const stage = el.querySelector(".zm-stage"), hint = el.querySelector(".mm-hint");
  let s = 1, s0 = 1, tx = 0, ty = 0, lvls = [1];
  const size = () => [el.clientWidth, el.clientHeight];
  function clamp() {
    const [cw, ch] = size();
    tx = Math.min(0, Math.max(cw - W * s, tx)); ty = Math.min(0, Math.max(ch - H * s, ty));
    if (W * s < cw) tx = (cw - W * s) / 2; if (H * s < ch) ty = (ch - H * s) / 2;
  }
  const apply = () => { clamp(); stage.style.transform = `translate(${tx}px,${ty}px) scale(${s})`; };
  function centerOn(x, y) { const [cw, ch] = size(); tx = cw / 2 - x * s; ty = ch / 2 - y * s; apply(); }
  // livelli di zoom: mappa intera visibile, mappa che riempie il riquadro, poi due ingrandimenti
  function home() {
    const [cw, ch] = size(), fit = Math.min(cw / W, ch / H), fill = Math.max(cw / W, ch / H);
    s0 = 1; lvls = [...new Set([fit, fill, fill * 1.6, fill * 2.4].map(v => +v.toFixed(4)))];
    s = fill; centerOn(o.focus[0], o.focus[1]);
  }
  function zoomBy(dir, px, py) {
    let cur = 0; lvls.forEach((l, k) => { if (Math.abs(s - l) < Math.abs(s - lvls[cur])) cur = k; });
    const nx = Math.max(0, Math.min(lvls.length - 1, cur + dir));
    const [cw, ch] = size(); px = px ?? cw / 2; py = py ?? ch / 2;
    const wx = (px - tx) / s, wy = (py - ty) / s; s = lvls[nx]; tx = px - wx * s; ty = py - wy * s; apply();
  }
  let ht; const showHint = t => { hint.textContent = t; el.classList.add("mm-hinting"); clearTimeout(ht); ht = setTimeout(() => el.classList.remove("mm-hinting"), 1400); };
  let drag = null;
  el.addEventListener("mousedown", e => { if (e.target.closest(".mm-ctrl")) return; drag = [e.clientX, e.clientY]; el.classList.add("mm-drag"); e.preventDefault(); });
  addEventListener("mousemove", e => { if (!drag) return; tx += e.clientX - drag[0]; ty += e.clientY - drag[1]; drag = [e.clientX, e.clientY]; apply(); });
  addEventListener("mouseup", () => { drag = null; el.classList.remove("mm-drag"); });
  el.addEventListener("dblclick", e => { const r = el.getBoundingClientRect(); zoomBy(1, e.clientX - r.left, e.clientY - r.top); });
  let t2 = null;
  const mid = ts => [(ts[0].clientX + ts[1].clientX) / 2, (ts[0].clientY + ts[1].clientY) / 2];
  const dist = ts => Math.hypot(ts[0].clientX - ts[1].clientX, ts[0].clientY - ts[1].clientY);
  el.addEventListener("touchstart", e => { if (e.touches.length === 2) t2 = { m: mid(e.touches), d: dist(e.touches) }; }, { passive: true });
  el.addEventListener("touchmove", e => {
    if (e.touches.length === 1 && !t2) { showHint("Usa due dita per spostare la mappa"); return; }
    if (e.touches.length !== 2 || !t2) return;
    e.preventDefault();
    const m = mid(e.touches), d = dist(e.touches), r = el.getBoundingClientRect();
    tx += m[0] - t2.m[0]; ty += m[1] - t2.m[1]; t2.m = m; apply();
    if (d / t2.d > 1.4) { zoomBy(1, m[0] - r.left, m[1] - r.top); t2.d = d; } else if (d / t2.d < .7) { zoomBy(-1, m[0] - r.left, m[1] - r.top); t2.d = d; }
  }, { passive: false });
  el.addEventListener("touchend", e => { if (e.touches.length < 2) t2 = null; });
  el.querySelectorAll("[data-z]").forEach(b => b.onclick = () => zoomBy(+b.dataset.z));
  el.querySelector("[data-home]").onclick = () => { highlight(null); home(); };
  function highlight(i) {
    el.classList.toggle("zm-focus", i != null);
    el.querySelectorAll("[data-zi]").forEach(p => p.classList.toggle("on", +p.dataset.zi === i));
    if (i != null) { const b = ZONE_BADGE[i]; centerOn(b[0], b[1]); }
  }
  if ("ResizeObserver" in window) new ResizeObserver(home).observe(el); else addEventListener("resize", home);
  home();
  return { highlight };
}
