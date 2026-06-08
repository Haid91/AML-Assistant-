const $ = (id) => document.getElementById(id);

const els = {
  input: $('input'),
  error: $('error'),
  indicators: $('indicators'),
  typologies: $('typologies'),
  narrative: $('narrative'),
  quality: $('quality'),
  copy: $('copy'),
};

function showError(message) {
  if (!message) {
    els.error.hidden = true;
    els.error.textContent = '';
    return;
  }
  els.error.hidden = false;
  els.error.textContent = message;
}

function parseInput() {
  const raw = els.input.value.trim();
  if (!raw) throw new Error('Paste transaction JSON, or click "Load sample data".');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Input is not valid JSON.');
  }
  const transactions = Array.isArray(parsed) ? parsed : parsed.transactions;
  if (!Array.isArray(transactions) || transactions.length === 0) {
    throw new Error('Expected a "transactions" array (or a bare array of transactions).');
  }
  const profile = Array.isArray(parsed) ? null : parsed.profile || null;
  return { transactions, profile };
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

function renderIndicators(indicators) {
  if (!indicators.length) {
    els.indicators.innerHTML = '<p class="muted">No indicators detected.</p>';
    return;
  }
  els.indicators.innerHTML = indicators
    .map(
      (i) => `
      <div class="card ${i.severity}">
        <div class="name">${i.name}<span class="badge ${i.severity}">${i.severity}</span></div>
        <div class="detail">${escapeHtml(i.detail)}</div>
      </div>`
    )
    .join('');
}

function renderTypologies(typologies) {
  if (!typologies.length) {
    els.typologies.innerHTML = '<p class="muted">No typologies matched.</p>';
    return;
  }
  els.typologies.innerHTML = typologies
    .map(
      (t) => `
      <div class="card">
        <div class="name">${t.name}<span class="badge score">score ${t.score}</span></div>
        <div class="detail">${escapeHtml(t.summary)}</div>
        <div class="detail">Matched indicators: ${t.matchedIndicators.join(', ')}</div>
      </div>`
    )
    .join('');
}

function renderQuality(checks) {
  els.quality.innerHTML = checks
    .map(
      (c) => `
      <div class="check ${c.pass ? 'pass' : 'fail'}">
        <span class="mark">${c.pass ? '✓' : '✗'}</span>${c.item}
        <span class="note">${escapeHtml(c.note)}</span>
      </div>`
    )
    .join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function analyse() {
  showError(null);
  try {
    const { transactions, profile } = parseInput();
    const data = await postJSON('/api/analyse', { transactions, profile });
    renderIndicators(data.indicators);
    renderTypologies(data.suggestedTypologies);
  } catch (e) {
    showError(e.message);
  }
}

async function draft() {
  showError(null);
  try {
    const { transactions, profile } = parseInput();
    const data = await postJSON('/api/draft', { transactions, profile });
    renderIndicators(data.indicators);
    renderTypologies(data.suggestedTypologies);
    renderQuality(data.qualityChecks);
    els.narrative.classList.remove('muted');
    els.narrative.textContent = `${data.narrative}\n\n— ${data.disclaimer}`;
    els.copy.hidden = false;
  } catch (e) {
    showError(e.message);
  }
}

async function loadSample() {
  showError(null);
  try {
    const res = await fetch('/api/sample');
    const data = await res.json();
    els.input.value = JSON.stringify(data, null, 2);
  } catch {
    showError('Could not load sample data.');
  }
}

$('analyse').addEventListener('click', analyse);
$('draft').addEventListener('click', draft);
$('loadSample').addEventListener('click', loadSample);
els.copy.addEventListener('click', () => {
  navigator.clipboard?.writeText(els.narrative.textContent);
  els.copy.textContent = 'Copied';
  setTimeout(() => (els.copy.textContent = 'Copy'), 1500);
});
