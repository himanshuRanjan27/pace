const params = new URLSearchParams(window.location.search);
const sportId = params.get('id');

const emojiMap = {
  'Chess': '♟️', 'Table Tennis': '🏓', 'Badminton': '🏸',
  'Squash': '🎾', 'Football': '⚽', 'Lawn Tennis': '🎾',
  'Kabaddi': '🤼', 'Basketball': '🏀', 'Volleyball': '🏐', 'Cricket': '🏏'
};

async function loadSportDetail() {
  const container = document.getElementById('sport-detail');

  if (!sportId) {
    window.location.href = '/';
    return;
  }

  try {
    const res = await fetch(`/api/sports/${sportId}`);
    if (!res.ok) throw new Error('Sport not found');
    const sport = await res.json();

    document.title = `${sport.name} — PACE 2027`;

    const prizes = sport.prizePool.split('|').map(p => p.trim());
    const prizeCards = [
      { label: '1st Place', medal: '🥇', cls: 'gold',   amount: prizes[0]?.split(': ')[1] || '—' },
      { label: '2nd Place', medal: '🥈', cls: 'silver', amount: prizes[1]?.split(': ')[1] || '—' },
      { label: '3rd Place', medal: '🥉', cls: 'bronze', amount: prizes[2]?.split(': ')[1] || '—' },
    ];

    container.innerHTML = `
      <div class="detail-hero">
        <div class="detail-hero-image">
          ${sport.imageUrl
            ? `<img src="${sport.imageUrl}" alt="${sport.name}">`
            : `<div class="detail-hero-image-placeholder">${emojiMap[sport.name] || '🏅'}</div>`
          }
        </div>
        <div class="detail-hero-content">
          <span class="detail-category-tag">
            ${sport.category === 'INDOOR' ? '🏢' : '🌿'} ${sport.category}
          </span>
          <h1 class="detail-sport-name">${sport.name}</h1>
          <div class="detail-fee-box">
            <div>
              <div class="detail-fee-label">Registration Fee</div>
              <div class="detail-fee-value">₹${sport.registrationFee}</div>
            </div>
            <a href="register.html?sportId=${sport.id}" class="btn btn-primary">Register Now →</a>
          </div>
          ${sport.eventHeadContact ? `
          <div style="display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:0.92rem;">
            <span>📞</span>
            <span>Event Head: <strong style="color:var(--text-primary);">${sport.eventHeadContact}</strong></span>
          </div>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Prize <span>Pool</span></h2>
        </div>
        <div class="prize-grid">
          ${prizeCards.map(p => `
            <div class="prize-card ${p.cls}">
              <span class="prize-medal">${p.medal}</span>
              <div class="prize-position">${p.label}</div>
              <div class="prize-amount">${p.amount}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:36px; align-items:center;">
          ${sport.rulebookUrl ? `
          <a href="${sport.rulebookUrl}" target="_blank" rel="noopener" class="btn btn-outline">
            📖 Download Rulebook
          </a>` : ''}
          <a href="register.html?sportId=${sport.id}" class="btn btn-primary">
            Register Your Team →
          </a>
          <a href="/" class="btn btn-outline btn-sm">← All Sports</a>
        </div>
      </div>
    `;

  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center; padding:120px 20px; color:var(--text-muted);">
        <p style="font-size:3rem; margin-bottom:16px;">🏅</p>
        <p>Sport not found. <a href="/" style="color:var(--accent);">Go back home →</a></p>
      </div>`;
  }
}

loadSportDetail();
