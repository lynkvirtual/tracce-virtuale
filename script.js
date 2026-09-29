/* ===== Configuración: cambia aquí tu número de WhatsApp (código de país + número, sin + ni espacios) ===== */
const WA_NUMBER = "52 7551323184";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const RED = ["#ff2347", "#dc1638", "#ff5a75", "#a90b29", "#7a0a1c"];

/* ---------- Sonido (sintetizado, sin archivos) ---------- */
let audio = null, soundOn = false;
function beep(freq, dur, type = "square", vol = 0.04) {
  if (!soundOn) return;
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  const o = audio.createOscillator(), g = audio.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, audio.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 1.6, audio.currentTime + dur);
  g.gain.setValueAtTime(vol, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + dur);
}
const soundBtn = $("#sound");
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.setAttribute("aria-pressed", soundOn);
  soundBtn.textContent = "SONIDO: " + (soundOn ? "SÍ" : "NO");
  beep(520, 0.15, "sawtooth", 0.05);
});
document.addEventListener("mouseover", e => { if (e.target.closest(".btn,.menu a,.card,.eco,.step,.sound")) beep(680, 0.06, "sine", 0.025); });
document.addEventListener("click", e => { if (e.target.closest(".btn,.menu a,.wa")) beep(300, 0.14, "square", 0.05); });

/* ---------- Menú, progreso, cursor ---------- */
$("#toggle").addEventListener("click", () => $("#menu").classList.toggle("open"));
$$(".menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#bar").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });
const cur = $("#cursor");
addEventListener("mousemove", e => { cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });

/* ---------- Aparición al hacer scroll ---------- */
$$(".card,.eco,.tl,.step,.section-head,.split>*,.flow,.lead-form").forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); beep(240, 0.05, "sine", 0.015); }
}), { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

/* ---------- Inclinación 3D en tarjetas ---------- */
if (!reduce) $$(".tilt").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  c.addEventListener("mouseleave", () => c.style.transform = "");
});

/* ---------- Ilustraciones animadas en canvas ---------- */
function fit(c) {
  const d = Math.min(devicePixelRatio || 1, 2), r = c.getBoundingClientRect();
  c.width = r.width * d; c.height = r.height * d;
  const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0);
  return { x, w: r.width, h: r.height };
}
const scenes = {
  net(x, w, h, t, s) {
    s.n = s.n || Array.from({ length: Math.min(110, Math.max(26, (w * h / 14000) | 0)) }, () => ({ x: Math.random() * w, y: Math.random() * h, a: Math.random() * 6.28 }));
    s.n.forEach(p => { p.x += Math.cos(p.a) * 0.3; p.y += Math.sin(p.a) * 0.3; if (p.x < 0 || p.x > w) p.a = Math.PI - p.a; if (p.y < 0 || p.y > h) p.a = -p.a; });
    s.n.forEach((p, i) => { s.n.slice(i + 1).forEach(q => { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 110) { x.strokeStyle = `rgba(255,35,71,${1 - d / 110})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } }); x.fillStyle = RED[2]; x.beginPath(); x.arc(p.x, p.y, 2.5, 0, 6.28); x.fill(); });
  },
  radar(x, w, h, t) {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42; x.strokeStyle = "rgba(255,35,71,.35)";
    [0.33, 0.66, 1].forEach(k => { x.beginPath(); x.arc(cx, cy, R * k, 0, 6.28); x.stroke(); });
    x.beginPath(); x.moveTo(cx - R, cy); x.lineTo(cx + R, cy); x.moveTo(cx, cy - R); x.lineTo(cx, cy + R); x.stroke();
    const a = t / 700, g = x.createConicGradient ? x.createConicGradient(a, cx, cy) : null;
    if (g) { g.addColorStop(0, "rgba(255,35,71,.55)"); g.addColorStop(0.25, "rgba(255,35,71,0)"); g.addColorStop(1, "rgba(255,35,71,0)"); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 6.28); x.fill(); }
    for (let i = 0; i < 7; i++) { const b = i * 2.1 + 1, d = R * (0.3 + ((i * 37) % 60) / 100); x.fillStyle = RED[i % 3]; x.beginPath(); x.arc(cx + Math.cos(b) * d, cy + Math.sin(b) * d, 3 + 2 * Math.sin(t / 300 + i), 0, 6.28); x.fill(); }
  },
  shield(x, w, h, t) {
    const cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.3, p = 0.5 + 0.5 * Math.sin(t / 500);
    x.shadowColor = "#ff2347"; x.shadowBlur = 16 + 14 * p; x.strokeStyle = "#ff2347"; x.lineWidth = 2.5;
    x.beginPath(); x.moveTo(cx, cy - s * 1.2); x.lineTo(cx + s, cy - s * 0.6); x.lineTo(cx + s * 0.85, cy + s * 0.5); x.quadraticCurveTo(cx, cy + s * 1.4, cx, cy + s * 1.4); x.quadraticCurveTo(cx, cy + s * 1.4, cx - s * 0.85, cy + s * 0.5); x.lineTo(cx - s, cy - s * 0.6); x.closePath(); x.stroke();
    x.shadowBlur = 0; x.strokeStyle = RED[2]; x.lineWidth = 1;
    for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(cx, cy, s * (0.35 + i * 0.12), t / 900 + i, t / 900 + i + 2); x.stroke(); }
    const sy = cy - s + ((t / 8) % (s * 2)); x.fillStyle = "rgba(255,90,117,.5)"; x.fillRect(cx - s * 0.8, sy, s * 1.6, 2);
  },
  eye(x, w, h, t) {
    const cx = w / 2, cy = h / 2, W = Math.min(w * 0.4, 130), o = Math.abs(Math.sin(t / 1400)) * 0.35 + 0.65;
    x.shadowColor = "#ff2347"; x.shadowBlur = 14; x.strokeStyle = "#ff2347"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(cx - W, cy); x.quadraticCurveTo(cx, cy - W * 0.7 * o, cx + W, cy); x.quadraticCurveTo(cx, cy + W * 0.7 * o, cx - W, cy); x.stroke(); x.shadowBlur = 0;
    const px = cx + Math.sin(t / 900) * W * 0.25; x.fillStyle = RED[1]; x.beginPath(); x.arc(px, cy, W * 0.24, 0, 6.28); x.fill(); x.fillStyle = "#000"; x.beginPath(); x.arc(px, cy, W * 0.1, 0, 6.28); x.fill();
    x.fillStyle = "rgba(255,90,117,.55)"; x.font = "10px Rajdhani"; for (let i = 0; i < 5; i++) x.fillText(((t / 30 + i * 977) | 0).toString(16).toUpperCase().slice(-4), 12, 22 + i * 14);
  },
  wave(x, w, h, t) {
    RED.slice(0, 4).forEach((c, k) => { x.strokeStyle = c; x.lineWidth = 2; x.beginPath(); for (let i = 0; i <= w; i += 4) { const y = h / 2 + Math.sin(i / 34 + t / (500 + k * 120) + k) * (18 + k * 9); i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); });
  },
  grid(x, w, h, t) {
    const cs = 72, n = Math.ceil(w / cs), m = Math.ceil(h / cs);
    for (let i = 0; i < n; i++) for (let k = 0; k < m; k++) { const v = 0.5 + 0.5 * Math.sin(t / 600 + i * 0.7 + k * 1.1); x.fillStyle = `rgba(255,35,71,${0.03 + v * 0.3})`; x.fillRect(i * cs + 3, k * cs + 3, cs - 6, cs - 6); }
  }
};
const arts = $$("canvas[data-art]").map(c => ({ c, f: scenes[c.dataset.art], s: {}, v: false, ...fit(c) }));
new IntersectionObserver(es => es.forEach(e => { const a = arts.find(a => a.c === e.target); if (a) a.v = e.isIntersecting; })).observe && arts.forEach(a => new IntersectionObserver(es => a.v = es[0].isIntersecting).observe(a.c));
addEventListener("resize", () => arts.forEach(a => { Object.assign(a, fit(a.c)); a.s = {}; }));

/* ---------- Fondo del inicio ---------- */
const hc = $("#hero-canvas"); let H = fit(hc), P = [];
const mk = () => { H = fit(hc); P = Array.from({ length: Math.min(90, H.w / 14) | 0 }, () => ({ x: Math.random() * H.w, y: Math.random() * H.h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 })); };
mk(); addEventListener("resize", mk);
let mx = -999, my = -999; hc.addEventListener("mousemove", e => { const r = hc.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
function hero() {
  const { x, w, h } = H; x.clearRect(0, 0, w, h);
  P.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
    const dm = Math.hypot(p.x - mx, p.y - my); if (dm < 140) { p.x += (p.x - mx) * 0.02; p.y += (p.y - my) * 0.02; }
    x.fillStyle = RED[i % 3]; x.beginPath(); x.arc(p.x, p.y, 2, 0, 6.28); x.fill();
    for (let j = i + 1; j < P.length; j++) { const d = Math.hypot(p.x - P[j].x, p.y - P[j].y); if (d < 120) { x.strokeStyle = `rgba(255,35,71,${0.5 * (1 - d / 120)})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(P[j].x, P[j].y); x.stroke(); } }
  });
}

/* ---------- Bucle de animación ---------- */
function loop(t) {
  if (!reduce) hero();
  arts.forEach(a => { if (a.v || reduce) { a.x.clearRect(0, 0, a.w, a.h); a.f(a.x, a.w, a.h, reduce ? 1000 : t, a.s); } });
  if (!reduce) requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
if (reduce) { hero(); }

/* ---------- WhatsApp ---------- */
const waLink = m => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`;
$("#wa").href = waLink("Hola, me interesa conocer más sobre Tracce Virtuale.");
$("#form").addEventListener("submit", e => {
  e.preventDefault(); const f = new FormData(e.target);
  const msg = `Hola, soy ${f.get("nombre")}${f.get("empresa") ? " de " + f.get("empresa") : ""}.\nMe interesa: ${f.get("interes")}.\n${f.get("mensaje")}`;
  window.open(waLink(msg), "_blank", "noopener");
});
