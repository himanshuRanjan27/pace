let memberCount = 0;
let sportsData  = [];

const urlParams = new URLSearchParams(window.location.search);
const preselectedSportId = urlParams.get('sportId');

async function loadSports() {
  try {
    const res = await fetch('/api/sports');
    sportsData = await res.json();
    const select = document.getElementById('sport');

    sportsData.forEach(sport => {
      const opt = document.createElement('option');
      opt.value = sport.id;
      opt.textContent = `${sport.name} (${sport.category}) — ₹${sport.registrationFee}`;
      if (String(sport.id) === preselectedSportId) opt.selected = true;
      select.appendChild(opt);
    });

    if (preselectedSportId) updateFeeDisplay(preselectedSportId);
  } catch (e) {
    console.error('Failed to load sports:', e);
  }
}

document.getElementById('sport').addEventListener('change', function () {
  updateFeeDisplay(this.value);
});

function updateFeeDisplay(sportId) {
  const sport = sportsData.find(s => String(s.id) === String(sportId));
  const display = document.getElementById('fee-display');
  if (sport) {
    display.innerHTML = `Pay <strong style="color:var(--accent);">₹${sport.registrationFee}</strong> for ${sport.name}`;
  } else {
    display.textContent = 'Select a sport to see the fee';
  }
}

document.getElementById('add-member-btn').addEventListener('click', addMember);

function addMember() {
  memberCount++;
  const list = document.getElementById('members-list');
  const row = document.createElement('div');
  row.className = 'member-row';
  row.dataset.index = memberCount;
  row.innerHTML = `
    <div class="form-group">
      <label>Member ${memberCount} Name *</label>
      <input type="text" name="memberName_${memberCount}" placeholder="Full name" required>
    </div>
    <div class="form-group">
      <label>Student ID *</label>
      <input type="text" name="studentId_${memberCount}" placeholder="Roll / ID number" required>
    </div>
    <button type="button" class="remove-member-btn" onclick="removeMember(this)" title="Remove member">✕</button>
  `;
  list.appendChild(row);
  document.getElementById('members-error').textContent = '';
}

function removeMember(btn) {
  btn.closest('.member-row').remove();
}

function copyUpiId(el) {
  const upiId = document.getElementById('upi-id-text').textContent;
  navigator.clipboard.writeText(upiId).then(() => {
    const label = el.querySelector('span:last-child');
    label.textContent = '✓ COPIED!';
    label.style.color = 'var(--green)';
    setTimeout(() => {
      label.textContent = 'CLICK TO COPY';
      label.style.color = '';
    }, 2000);
  });
}

function validateForm(data) {
  let valid = true;

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('input, select').forEach(el => el.classList.remove('input-error'));

  const showError = (fieldId, msg) => {
    const errEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errEl) errEl.textContent = msg;
    if (inputEl) inputEl.classList.add('input-error');
    valid = false;
  };

  if (!data.sportId)     showError('sport',        'Please select a sport.');
  if (!data.teamName)    showError('teamName',      'Team name is required.');
  if (!data.captainName) showError('captainName',   'Captain name is required.');

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.captainPhone)                     showError('captainPhone', 'Phone number is required.');
  else if (!phoneRegex.test(data.captainPhone)) showError('captainPhone', 'Enter a valid 10-digit Indian mobile number.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.captainEmail)                       showError('captainEmail', 'Email is required.');
  else if (!emailRegex.test(data.captainEmail)) showError('captainEmail', 'Enter a valid email address.');

  if (!data.utrNumber)                   showError('utrNumber', 'UTR number is required.');
  else if (data.utrNumber.length !== 12) showError('utrNumber', 'UTR must be exactly 12 characters.');

  if (data.members.length === 0) {
    document.getElementById('members-error').textContent = 'Add at least one team member.';
    valid = false;
  }

  return valid;
}

function collectFormData() {
  const members = [];
  document.querySelectorAll('.member-row').forEach(row => {
    const idx = row.dataset.index;
    const memberName = row.querySelector(`[name="memberName_${idx}"]`).value.trim();
    const studentId  = row.querySelector(`[name="studentId_${idx}"]`).value.trim();
    members.push({ memberName, studentId });
  });

  return {
    sportId:      document.getElementById('sport').value,
    teamName:     document.getElementById('teamName').value.trim(),
    captainName:  document.getElementById('captainName').value.trim(),
    captainEmail: document.getElementById('captainEmail').value.trim(),
    captainPhone: document.getElementById('captainPhone').value.trim(),
    utrNumber:    document.getElementById('utrNumber').value.trim(),
    members
  };
}

document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formError = document.getElementById('form-error');
  formError.style.display = 'none';

  const data = collectFormData();
  if (!validateForm(data)) return;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      const msg = result.error
        || Object.values(result).join(' | ')
        || 'Submission failed. Please check your details.';
      formError.textContent = '⚠ ' + msg;
      formError.style.display = 'block';
      return;
    }

    document.getElementById('modal-email').textContent = result.captainEmail;
    document.getElementById('success-modal').classList.add('active');

  } catch (err) {
    formError.textContent = '⚠ Network error. Please check your connection and try again.';
    formError.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration →';
  }
});

loadSports();
