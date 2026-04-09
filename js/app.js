// ── Storage ──
const Store = {
  get(k, fb = null) {
    try { const r = localStorage.getItem(k); return r === null ? fb : JSON.parse(r); }
    catch { return fb; }
  },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const KEYS = { TASKS: 'vwa_tasks', LINKS: 'vwa_links' };

// ── Theme Toggle ──
(function() {
  const btn = document.getElementById('theme-toggle');
  const saved = Store.get('vwa_theme', 'light');
  if (saved === 'dark') { document.body.classList.add('dark'); btn.textContent = '☀️'; }
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    Store.set('vwa_theme', isDark ? 'dark' : 'light');
  });
})();

// ── Greeting ──
function tick() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = `${hh}:${mm}:${ss}`;
  document.getElementById('date').textContent = now.toLocaleDateString('en-GB',
    { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const h = now.getHours();
  let g = 'Good Night';
  if (h >= 5 && h <= 11) g = 'Good Morning';
  else if (h >= 12 && h <= 17) g = 'Good Afternoon';
  else if (h >= 18 && h <= 21) g = 'Good Evening';
  document.getElementById('greeting-text').textContent = g;
}
tick(); setInterval(tick, 1000);

// ── Timer ──
let timerRemaining = 25 * 60;
let timerInterval = null;

function renderTimer() {
  const m = Math.floor(timerRemaining / 60);
  const s = timerRemaining % 60;
  document.getElementById('timer-display').textContent =
    `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

document.getElementById('apply-duration').addEventListener('click', () => {
  const val = parseInt(document.getElementById('pomo-duration').value, 10);
  if (val > 0 && val <= 120) {
    clearInterval(timerInterval); timerInterval = null;
    timerRemaining = val * 60;
    renderTimer();
  }
});

document.getElementById('timer-start').addEventListener('click', () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();
    if (timerRemaining <= 0) { clearInterval(timerInterval); timerInterval = null; }
  }, 1000);
});

document.getElementById('timer-stop').addEventListener('click', () => {
  clearInterval(timerInterval); timerInterval = null;
});

document.getElementById('timer-reset').addEventListener('click', () => {
  clearInterval(timerInterval); timerInterval = null;
  const val = parseInt(document.getElementById('pomo-duration').value, 10) || 25;
  timerRemaining = val * 60;
  renderTimer();
});

// ── Tasks ──
let tasks = Store.get(KEYS.TASKS, []);

function renderTasks() {
  const ul = document.getElementById('task-list');
  ul.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    if (t.completed) li.classList.add('completed');

    // checkbox
    const cb = document.createElement('div');
    cb.className = 'task-checkbox' + (t.completed ? ' checked' : '');
    cb.addEventListener('click', () => {
      t.completed = !t.completed;
      Store.set(KEYS.TASKS, tasks);
      renderTasks();
    });

    const label = document.createElement('span');
    label.className = 'task-label';
    label.textContent = t.label;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.className = 'task-label-input';
      inp.value = t.label;
      li.replaceChild(inp, label);

      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn-save';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => {
        const v = inp.value.trim();
        if (!v) { renderTasks(); return; }
        if (isDuplicate(v, t.id)) {
          inp.style.borderColor = '#e55';
          inp.title = `"${v}" already exists.`;
          inp.focus();
          return;
        }
        t.label = v; Store.set(KEYS.TASKS, tasks);
        renderTasks();
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });
      li.replaceChild(saveBtn, editBtn);
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      tasks = tasks.filter(x => x.id !== t.id);
      Store.set(KEYS.TASKS, tasks);
      renderTasks();
    });

    li.appendChild(cb);
    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

function isDuplicate(label, excludeId = null) {
  return tasks.some(t => t.id !== excludeId && t.label.toLowerCase() === label.toLowerCase());
}

function addTask() {
  const inp = document.getElementById('task-input');
  const v = inp.value.trim();
  const err = document.getElementById('task-error');
  if (!v) { err.textContent = 'Task cannot be empty.'; return; }
  if (isDuplicate(v)) { err.textContent = `"${v}" already exists in your task list.`; inp.select(); return; }
  err.textContent = '';
  tasks.push({ id: Date.now().toString(), label: v, completed: false });
  Store.set(KEYS.TASKS, tasks);
  inp.value = '';
  renderTasks();
}

document.getElementById('task-add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

renderTasks();

// ── Links ──
let links = Store.get(KEYS.LINKS, []);

function renderLinks() {
  const wrap = document.getElementById('link-buttons');
  wrap.innerHTML = '';
  links.forEach(l => {
    const w = document.createElement('div');
    w.className = 'link-btn-wrap';

    const a = document.createElement('a');
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = l.label;

    const del = document.createElement('button');
    del.className = 'btn-del-link';
    del.textContent = '✕';
    del.addEventListener('click', () => {
      links = links.filter(x => x.id !== l.id);
      Store.set(KEYS.LINKS, links);
      renderLinks();
    });

    w.appendChild(a);
    w.appendChild(del);
    wrap.appendChild(w);
  });
}

function addLink() {
  const lblEl = document.getElementById('link-label');
  const urlEl = document.getElementById('link-url');
  const err = document.getElementById('link-error');
  const lbl = lblEl.value.trim();
  const url = urlEl.value.trim();
  if (!lbl) { err.textContent = 'Label cannot be empty.'; return; }
  try { new URL(url); } catch { err.textContent = 'Please enter a valid URL.'; return; }
  err.textContent = '';
  links.push({ id: Date.now().toString(), label: lbl, url });
  Store.set(KEYS.LINKS, links);
  lblEl.value = ''; urlEl.value = '';
  renderLinks();
}

document.getElementById('link-add-btn').addEventListener('click', addLink);

renderLinks();