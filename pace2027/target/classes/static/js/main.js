// ══════════════════════════════════════════════
//  PACE 2027 — Homepage JS (Upgraded)
// ══════════════════════════════════════════════

const API = '/api/sports';
let allSports = [];

// ── 1. Particle Canvas ────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      r:     randomBetween(0.5, 2),
      dx:    randomBetween(-0.3, 0.3),
      dy:    randomBetween(-0.6, -0.1),
      alpha: randomBetween(0.1, 0.6),
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245,166,35,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      // Reset particle when it goes off screen
      if (p.y < -10) { p.y = H + 10; p.x = randomBetween(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,166,35,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

// ── 2. Floating Sport Emojis ──────────────────
(function initFloatingEmojis() {
  const container = document.getElementById('floating-emojis');
  const emojis = ['⚽','🏏','🏀','🏐','🎾','🏸','♟️','🏓','🤼','🥇'];
  const positions = [5,12,20,30,42,55,65,75,85,92];

  emojis.forEach((emoji, i) => {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = emoji;
    el.style.cssText = `
      left: ${positions[i]}%;
      --dur: ${8 + Math.random() * 8}s;
      --delay: ${Math.random() * 6}s;
    `;
    container.appendChild(el);
  });
})();

// ── 3. Countdown Timer ────────────────────────
(function initCountdown() {
  // SET YOUR EVENT DATE HERE: 'YYYY-MM-DDTHH:MM:SS'
  const eventDate = new Date('2027-01-28T09:00:00');

  function update() {
    const now  = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
          `<div style="font-family:var(--font-display); font-size:2rem; color:var(--accent); letter-spacing:0.1em;">
           🏆 EVENT IS LIVE!
         </div>`;
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');

    const dEl = document.getElementById('cd-days');
    const sEl = document.getElementById('cd-secs');

    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);

    // Pulse seconds every tick
    sEl.classList.remove('pulse');
    void sEl.offsetWidth; // reflow trick to restart animation
    sEl.classList.add('pulse');
    setTimeout(() => sEl.classList.remove('pulse'), 900);
  }

  update();
  setInterval(update, 1000);
})();

// ── 4. Sports Ticker Marquee ──────────────────
(function initTicker() {
  const sports = [
    { name: 'Cricket',      emoji: '🏏' },
    { name: 'Football',     emoji: '⚽' },
    { name: 'Basketball',   emoji: '🏀' },
    { name: 'Volleyball',   emoji: '🏐' },
    { name: 'Badminton',    emoji: '🏸' },
    { name: 'Chess',        emoji: '♟️' },
    { name: 'Table Tennis', emoji: '🏓' },
    { name: 'Lawn Tennis',  emoji: '🎾' },
    { name: 'Kabaddi',      emoji: '🤼' },
    { name: 'Squash',       emoji: '🎾' },
  ];

  const track = document.getElementById('ticker-track');
  // Duplicate for seamless loop
  const all = [...sports, ...sports];
  track.innerHTML = all.map(s =>
      `<div class="ticker-item"><span>${s.emoji}</span>${s.name}</div>`
  ).join('');
})();

// ── 5. Navbar scroll effect ───────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── 6. Scroll Reveal ──────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── 7. Count-up animation for stats ──────────
(function initCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target  = parseInt(el.dataset.target);
        const prefix  = el.dataset.prefix  || '';
        const suffix  = el.dataset.suffix  || '';
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          const value    = Math.floor(ease * target);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else { el.textContent = prefix + target + suffix; el.classList.add('counted'); }
        }
        requestAnimationFrame(step);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
})();

// ── 8. Load Sports Cards ──────────────────────
async function loadSports() {
  const grid = document.getElementById('sports-grid');
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Failed to fetch');
    allSports = await res.json();
    renderCards(allSports);
  } catch (err) {
    grid.innerHTML = `
      <div style="color:var(--red); font-family:var(--font-mono); font-size:0.8rem; padding:20px;">
        ⚠ Could not load sports. Is the server running?
      </div>`;
  }
}

function renderCards(sports) {
  const grid = document.getElementById('sports-grid');
  if (!sports.length) {
    grid.innerHTML = `<p style="color:var(--text-muted); font-style:italic;">No sports found.</p>`;
    return;
  }

  const emojiMap = {
    'Chess': '♟️', 'Table Tennis': '🏓', 'Badminton': '🏸',
    'Squash': '🎾', 'Football': '⚽', 'Lawn Tennis': '🎾',
    'Kabaddi': '🤼', 'Basketball': '🏀', 'Volleyball': '🏐', 'Cricket': '🏏'
  };

  grid.innerHTML = sports.map((sport, i) => `
    <a href="sport.html?id=${sport.id}" class="sport-card"
       data-category="${sport.category}"
       style="animation: heroReveal 0.5s ease forwards; animation-delay:${i * 0.07}s; opacity:0;">
      ${sport.imageUrl
      ? `<img class="sport-card-img" src="${sport.imageUrl}" alt="${sport.name}" loading="lazy">`
      : `<div class="sport-card-img-placeholder">${emojiMap[sport.name] || '🏅'}</div>`
  }
      <div class="sport-card-body">
        <p class="sport-card-category">${sport.category}</p>
        <h3 class="sport-card-name">${sport.name}</h3>
        <div class="sport-card-fee">
          <span style="color:var(--text-muted); font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase;">Fee</span>
          <span class="fee-amount">₹${sport.registrationFee}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// ── Filter buttons ────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter  = btn.dataset.filter;
    const filtered = filter === 'ALL' ? allSports : allSports.filter(s => s.category === filter);
    renderCards(filtered);
  });
});

loadSports();