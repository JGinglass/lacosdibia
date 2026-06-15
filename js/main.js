/* ════════════════════════════════════════════════════════
   Laços di Bia · interações
   reveal on scroll · parallax · partículas · fotos
   ════════════════════════════════════════════════════════ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── 1 · Reveal on scroll ───────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal, .roll").forEach((el) => revealObserver.observe(el));

/* ── 2 · Parallax suave ─────────────────────────────── */
const parallaxEls = [...document.querySelectorAll("[data-parallax]")];

if (!reducedMotion && parallaxEls.length) {
  let ticking = false;

  const updateParallax = () => {
    const vh = window.innerHeight;
    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      const speed = parseFloat(el.dataset.parallax);
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateParallax();
}

/* ── 3 · Partículas (poeira mágica) ─────────────────── */
const canvas = document.getElementById("sparkle-canvas");

if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d");
  const COLORS = ["#F6BFCB", "#FADADD", "#CDE7F0", "#FFFFFF", "#F28CAB"];
  let particles = [];
  let w, h;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(46, Math.floor(w / 30)); // leve: máx. 46 partículas
    particles = Array.from({ length: count }, () => spawn(true));
  };

  const spawn = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 8,
    r: 0.8 + Math.random() * 2.2,
    vy: -(0.12 + Math.random() * 0.35),
    vx: (Math.random() - 0.5) * 0.18,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    alpha: 0.2 + Math.random() * 0.5,
    twinkle: Math.random() * Math.PI * 2,
  });

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.vy;
      p.x += p.vx;
      p.twinkle += 0.03;
      if (p.y < -10) particles[i] = spawn(false);

      ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
}

/* ── 4 · Fotos reais (substituem o placeholder) ─────── */
/* Basta colocar o arquivo no caminho indicado em data-img:
   se a imagem existir, ela aparece; se não, o placeholder fica. */
document.querySelectorAll(".img-slot[data-img]").forEach((slot) => {
  const img = new Image();
  img.alt = slot.querySelector("figcaption")?.textContent.trim() || "Laços di Bia — peça artesanal";
  img.loading = "lazy";
  img.decoding = "async";
  img.style.opacity = "0";
  img.style.transition = "opacity .6s ease";
  if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos; // enquadramento por foto

  // data-fit="contain": mostra a foto inteira, com a própria foto
  // desfocada preenchendo o fundo (para fotos verticais em card horizontal)
  let bg = null;
  if (slot.dataset.fit === "contain") {
    img.style.objectFit = "contain";
    bg = new Image();
    bg.src = slot.dataset.img;
    bg.alt = "";
    bg.setAttribute("aria-hidden", "true");
    bg.style.objectFit = "cover";
    bg.style.filter = "blur(18px) saturate(1.1)";
    bg.style.transform = "scale(1.25)";
    bg.style.opacity = "0";
    bg.style.transition = "opacity .6s ease";
  }

  img.addEventListener("load", () => {
    slot.querySelector("figcaption")?.remove();
    slot.classList.add("has-img");
    if (bg) {
      slot.appendChild(bg);
      bg.style.opacity = ".55";
    }
    slot.appendChild(img); // garante a foto nítida por cima do fundo
    img.style.opacity = "1";
  });
  img.addEventListener("error", () => img.remove()); // sem foto → placeholder fica
  img.src = slot.dataset.img;
  slot.appendChild(img);
});

/* ── 5 · Navbar: sombra ao rolar ────────────────────── */
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.style.boxShadow =
      window.scrollY > 40
        ? "0 10px 38px -10px rgba(92, 68, 81, .28)"
        : "0 6px 30px -12px rgba(92, 68, 81, .18)";
  },
  { passive: true }
);
