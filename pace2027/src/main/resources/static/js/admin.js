let currentSportId   = null;
let currentSportName = 'All Sports';
let currentFilter    = 'ALL';
let allRegistrations = [];

document.addEventListener('DOMContentLoaded', () => {
  loadRegistrations();
  loadPendingBadges();
});

function selectSport(sportId, sportName, btnEl) {
  currentSportId   = sportId;
  currentSportName = sportName;
  currentFilter    = 'ALL';

  document.querySelectorAll('.sport-nav-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.filter-tab').classList.add('active');

  const titleEl = document.getElementById('page-title');
  titleEl.innerHTML = sportId
    ? `${sportName} <span>Registrations</span>`
    : `All <span>Sports</span>`;

  document.getElementById('page-subtitle').textContent = sportId
    ? `Reviewing registrations for ${sportName}`
    : 'Viewing all registrations across all sports';

  loadRegistrations();
}

async function loadRegistrations() {
  const container = document.getElementById('table-container');
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading registrations...</p>
    </div>`;

  try {
    const url = currentSportId
      ? `/api/admin/registrations?sportId=${currentSportId}`
      : `/api/admin/registrations/all`;

    const res = await fetch(url, { credentials: 'include' });

    if (res.status === 401 || res.status === 403) {
      window.location.href = '/admin/login';
      return;
    }

    allRegistrations = await res.json();
    updateSummaryCards();
    renderTable(filterRegistrations());

  } catch (err) {
    container.innerHTML = `
      <div class="table-empty" style="color:var(--red);">
        ⚠ Failed to load data. Check your connection.
      </div>`;
  }
}

async function loadPendingBadges() {
  if (!SPORTS_DATA || !SPORTS_DATA.length) return;
  for (const sport of SPORTS_DATA) {
    try {
      const res = await fetch(`/api/admin/registrations/pending?sportId=${sport.id}`, { credentials: 'include' });
      const data = await res.json();
      const badge = document.getElementById(`badge-${sport.id}`);
      if (badge) {
        badge.textContent = data.length || '0';
        if (data.length > 0) badge.style.background = 'var(--red)';
      }
    } catch (e) { /* silent */ }
  }
}

function applyFilter(status, btnEl) {
  currentFilter = status;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btnEl.classList.add('active');
  renderTable(filterRegistrations());
}

function filterRegistrations() {
  if (currentFilter === 'ALL') return allRegistrations;
  return allRegistrations.filter(r => r.paymentStatus === currentFilter);
}

function updateSummaryCards() {
  document.getElementById('count-total').textContent    = allRegistrations.length;
  document.getElementById('count-approved').textContent = allRegistrations.filter(r => r.paymentStatus === 'SUCCESS').length;
  document.getElementById('count-pending').textContent  = allRegistrations.filter(r => r.paymentStatus === 'PENDING').length;
}

function renderTable(registrations) {
  const container = document.getElementById('table-container');

  if (registrations.length === 0) {
    container.innerHTML = `<div class="table-empty">No registrations found for the selected filter.</div>`;
    return;
  }

  const rows = registrations.map(r => {
    const statusBadge = {
      PENDING: `<span class="status-badge status-pending">⏳ Pending</span>`,
      SUCCESS: `<span class="status-badge status-success">✓ Approved</span>`,
      FAILED:  `<span class="status-badge status-failed">✕ Rejected</span>`,
    }[r.paymentStatus] || r.paymentStatus;

    const actionHtml = r.paymentStatus === 'PENDING'
      ? `<div class="action-btns">
           <button class="approve-btn" onclick="confirmAction(${r.id}, 'approve', '${escHtml(r.teamName)}')">✓ Approve</button>
           <button class="reject-btn"  onclick="confirmAction(${r.id}, 'reject',  '${escHtml(r.teamName)}')">✕ Reject</button>
         </div>`
      : `<span class="action-done">— Done —</span>`;

    const membersHtml = r.members && r.members.length
      ? r.members.map(m =>
          `<div style="font-size:0.78rem; color:var(--text-muted); line-height:1.8;">
             ${escHtml(m.memberName)}
             <span style="color:var(--text-dim); font-family:var(--font-mono); font-size:0.65rem;">(${escHtml(m.studentId)})</span>
           </div>`
        ).join('')
      : '<span style="color:var(--text-dim); font-size:0.78rem;">—</span>';

    const date = new Date(r.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    return `
      <tr id="row-${r.id}">
        <td>
          <div class="td-team">${escHtml(r.teamName)}</div>
          <div style="color:var(--text-dim); font-size:0.78rem; margin-top:2px;">${escHtml(r.sportName)}</div>
        </td>
        <td>
          <div>${escHtml(r.captainName)}</div>
          <div class="td-mono">${escHtml(r.captainEmail)}</div>
          <div class="td-mono">${escHtml(r.captainPhone)}</div>
        </td>
        <td><span class="td-utr">${escHtml(r.utrNumber)}</span></td>
        <td>${membersHtml}</td>
        <td>${statusBadge}</td>
        <td><span class="td-mono">${date}</span></td>
        <td>${actionHtml}</td>
      </tr>`;
  }).join('');

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Team / Sport</th>
          <th>Captain</th>
          <th>UTR Number</th>
          <th>Members</th>
          <th>Status</th>
          <th>Registered</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

let pendingAction = null;

function confirmAction(id, action, teamName) {
  pendingAction = { id, action };
  const isApprove = action === 'approve';

  document.getElementById('confirm-title').textContent = isApprove ? 'Approve Team?' : 'Reject Team?';
  document.getElementById('confirm-body').innerHTML = isApprove
    ? `Approving <strong>${escHtml(teamName)}</strong> will mark their payment as
       <span style="color:var(--green);">SUCCESS</span> and send them a confirmation email.`
    : `Rejecting <strong>${escHtml(teamName)}</strong> will mark their payment as
       <span style="color:var(--red);">FAILED</span>. This cannot be undone easily.`;

  const okBtn = document.getElementById('confirm-ok-btn');
  okBtn.textContent = isApprove ? '✓ Yes, Approve' : '✕ Yes, Reject';
  okBtn.style.background = isApprove ? 'var(--green)' : 'var(--red)';
  okBtn.onclick = executeAction;

  document.getElementById('confirm-overlay').classList.add('active');
}

function closeConfirm() {
  document.getElementById('confirm-overlay').classList.remove('active');
  pendingAction = null;
}

async function executeAction() {
  if (!pendingAction) return;
  closeConfirm();

  const { id, action } = pendingAction;
  const row = document.getElementById(`row-${id}`);

  if (row) row.querySelectorAll('.approve-btn, .reject-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });

  try {
    const res = await fetch(`/api/admin/registrations/${id}/${action}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error(await res.text());

    const updated = await res.json();
    const idx = allRegistrations.findIndex(r => r.id === id);
    if (idx !== -1) allRegistrations[idx] = updated;

    updateSummaryCards();
    renderTable(filterRegistrations());
    loadPendingBadges();

    showToast(
      action === 'approve' ? '✓ Team approved! Confirmation email sent.' : '✕ Team rejected.',
      action === 'approve' ? 'success' : 'error'
    );

  } catch (err) {
    showToast('⚠ Action failed: ' + err.message, 'error');
    if (row) row.querySelectorAll('.approve-btn, .reject-btn').forEach(b => { b.disabled = false; b.style.opacity = '1'; });
  }
}

function exportCsv(e) {
  e.preventDefault();
  if (!currentSportId) {
    showToast('Select a specific sport to export its CSV.', 'info');
    return;
  }
  window.location.href = `/api/admin/registrations/export?sportId=${currentSportId}`;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.getElementById('confirm-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirm();
});
