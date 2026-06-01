// =============================================
// ONEVAKZ — script.js
// =============================================

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const BUSY_SLOTS = ['11:00','12:30','14:00','15:30'];

let state = {
  step: 1,
  service: '', duration: '', price: '',
  master: '',
  date: '', time: '',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderPopular();
  renderCategoryTabs('svc-cat-tabs', 'services-list', false);
  renderCategoryTabs('b-cat-tabs', 'b-services-list', true);
  renderServicesList('services-list', 'hair-cut', false);
  renderMastersGrid('masters-grid', null, false);
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav__search-wrap')) hideSearchDrop();
  });
  document.getElementById('stat-masters').textContent = getMasters().length;
});

// ============ PAGES ============
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'booking') {
    state.step = 1;
    state.service = ''; state.master = ''; state.date = ''; state.time = '';
    renderBookingStep();
  }
}

function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ============ MODALS ============
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

// ============ POPULAR ============
const POPULAR = [
  { name: 'Стрижка женская — средние волосы', dur: '50 мин', price: '5 000 – 20 000', cat: 'hair-cut' },
  { name: 'Маникюр гель-покрытие', dur: '2 часа', price: '6 000 – 7 000', cat: 'nails' },
  { name: 'Окрашивание в один тон', dur: '2 часа', price: '12 000 – 35 000', cat: 'color' },
  { name: 'Нанопластика волос', dur: '3 часа', price: '25 000 – 100 000', cat: 'care' },
  { name: 'Свадебная прическа', dur: '1 час', price: '8 000 – 10 000', cat: 'styling' },
  { name: 'Педикюр классический', dur: '1 час', price: '6 000', cat: 'nails' },
];

function renderPopular() {
  const el = document.getElementById('popular-list');
  if (!el) return;
  el.innerHTML = POPULAR.map((s, i) => `
    <div class="popular-item" onclick="startBooking('${s.name}','${s.dur}','${s.price}')">
      <div class="popular-item__num">0${i+1}</div>
      <div class="popular-item__name">${s.name}</div>
      <div class="popular-item__meta">
        <span>${s.dur}</span>
        <span class="popular-item__price">от ${s.price.split('–')[0].trim()} тг</span>
      </div>
    </div>
  `).join('');
}

// ============ CATEGORY TABS ============
function renderCategoryTabs(tabsId, listId, isBooking) {
  const container = document.getElementById(tabsId);
  if (!container) return;
  container.innerHTML = Object.entries(SERVICES_DATA).map(([key, cat]) =>
    `<button class="cat-tab${key==='hair-cut'?' active':''}" data-cat="${key}" onclick="switchCat(this,'${tabsId}','${listId}',${isBooking})">${cat.label}</button>`
  ).join('');
}

function switchCat(btn, tabsId, listId, isBooking) {
  document.querySelectorAll(`#${tabsId} .cat-tab`).forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderServicesList(listId, btn.dataset.cat, isBooking);
}

// ============ SERVICES LIST ============
function renderServicesList(containerId, cat, isBooking) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = (SERVICES_DATA[cat] || SERVICES_DATA['hair-cut']).items;
  container.innerHTML = list.map(s => `
    <div class="service-row" onclick="${isBooking ? `selectServiceFromList('${s.name}','${s.dur}','${s.price}',this)` : `startBooking('${s.name}','${s.dur}','${s.price}')`}">
      <div class="service-row__name">${s.name}</div>
      <div class="service-row__dur">${s.dur}</div>
      <div class="service-row__price">${s.price} тг</div>
      <div class="service-row__arrow">→</div>
    </div>
  `).join('');
}

// ============ MASTERS GRID ============
function renderMastersGrid(containerId, filterCat, selectable) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let masters = getMasters();
  if (filterCat) masters = masters.filter(m => m.services.includes(filterCat));
  if (!masters.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:14px;">Нет мастеров для этой услуги</p>';
    return;
  }
  container.innerHTML = masters.map(m => `
    <div class="master-card${selectable?' selectable':''}" data-master="${m.name}" onclick="${selectable?`selectMaster(this)`:`void(0)`}">
      <div class="master-card__avatar">${m.photo ? `<img src="${m.photo}" alt="${m.name}"/>` : m.initials}</div>
      <div class="master-card__name">${m.name}</div>
      <div class="master-card__spec">${m.spec}</div>
      ${!selectable ? `<div class="master-card__action">Записаться →</div>` : ''}
    </div>
  `).join('');
  if (!selectable) {
    container.querySelectorAll('.master-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.master;
        state.master = name; showPage('booking'); state.step = 1; renderBookingStep();
      });
    });
  }
}

// ============ SEARCH ============
function handleSearch(val) {
  const drop = document.getElementById('search-drop');
  if (!val.trim()) { drop.innerHTML = ''; drop.style.display = 'none'; return; }
  const q = val.toLowerCase();
  const results = [];
  Object.values(SERVICES_DATA).forEach(cat => {
    cat.items.forEach(s => {
      if (s.name.toLowerCase().includes(q)) results.push(s);
    });
  });
  getMasters().forEach(m => {
    if (m.name.toLowerCase().includes(q) || m.spec.toLowerCase().includes(q))
      results.push({ isMaster: true, name: m.name, spec: m.spec });
  });
  if (!results.length) { drop.innerHTML = '<div class="search-drop__empty">Ничего не найдено</div>'; drop.style.display = 'block'; return; }
  drop.innerHTML = results.slice(0,8).map(r => r.isMaster
    ? `<div class="search-drop__item" onclick="showPage('masters-page');hideSearchDrop()"><span class="search-drop__tag">Мастер</span>${r.name} — ${r.spec}</div>`
    : `<div class="search-drop__item" onclick="startBooking('${r.name}','${r.dur}','${r.price}');hideSearchDrop()"><span class="search-drop__tag">Услуга</span>${r.name} <em>${r.price} тг</em></div>`
  ).join('');
  drop.style.display = 'block';
}

function showSearchDrop() {
  const v = document.getElementById('search-input').value;
  if (v.trim()) handleSearch(v);
}
function hideSearchDrop() {
  const d = document.getElementById('search-drop');
  d.style.display = 'none';
}

// ============ BOOKING FLOW ============
function startBooking(name, dur, price) {
  state.service = name; state.duration = dur; state.price = price;
  showPage('booking'); state.step = 2;
  renderMastersForService(name);
  renderBookingStep();
}

function selectServiceFromList(name, dur, price, el) {
  state.service = name; state.duration = dur; state.price = price;
  document.querySelectorAll('#b-services-list .service-row').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
  setTimeout(() => {
    renderMastersForService(name);
    state.step = 2; renderBookingStep();
  }, 180);
}

function renderMastersForService(serviceName) {
  // find category of this service
  let cat = null;
  Object.entries(SERVICES_DATA).forEach(([key, c]) => {
    if (c.items.some(s => s.name === serviceName)) cat = key;
  });
  renderMastersGrid('b-masters-grid', cat, true);
}

function selectMaster(el) {
  document.querySelectorAll('#b-masters-grid .master-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.master = el.dataset.master;
  setTimeout(() => { state.step = 3; renderBookingStep(); }, 180);
}

function prevStep() {
  if (state.step > 1) { state.step--; renderBookingStep(); }
}

function renderBookingStep() {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('bs' + i);
    if (el) el.classList.toggle('active', i === state.step);
  }
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('bstep-ind-' + i);
    if (!el) continue;
    el.className = 'bstep' + (i < state.step ? ' done' : i === state.step ? ' active' : '');
  }
  const btnBack = document.getElementById('btn-back');
  if (btnBack) btnBack.style.display = (state.step > 1 && state.step < 5) ? 'inline-block' : 'none';
  const nav = document.getElementById('booking-nav');
  if (nav) nav.style.display = state.step === 5 ? 'none' : 'flex';
  if (state.step === 3) renderCalendar();
  if (state.step === 4) updateSummary();
}

// ============ CALENDAR ============
function changeMonth(dir) {
  state.calMonth += dir;
  if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
  if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
  renderCalendar();
}

function renderCalendar() {
  const { calYear: y, calMonth: m } = state;
  const now = new Date();
  document.getElementById('cal-month-label').textContent = MONTHS_RU[m] + ' ' + y;
  const firstDow = new Date(y, m, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  for (let i = 0; i < offset; i++) {
    const d = document.createElement('div'); d.className = 'cal-day cal-day--empty'; grid.appendChild(d);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    const today = d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    const past = new Date(y, m, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateStr = d + ' ' + MONTHS_GEN[m];
    let cls = 'cal-day' + (past?' cal-day--past':today?' cal-day--today':'') + (state.date===dateStr?' cal-day--selected':'');
    el.className = cls; el.textContent = d;
    if (!past) el.addEventListener('click', () => selectDate(d, dateStr, el));
    grid.appendChild(el);
  }
  document.getElementById('slots-section').style.display = state.date ? 'block' : 'none';
  if (state.date) renderSlots();
}

function selectDate(d, dateStr, el) {
  document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('cal-day--selected'));
  el.classList.add('cal-day--selected');
  state.date = dateStr; state.time = '';
  document.getElementById('slots-section').style.display = 'block';
  renderSlots();
}

function renderSlots() {
  const slots = [];
  for (let h = 10; h < 19; h++) { slots.push(pad(h)+':00'); if(h<18) slots.push(pad(h)+':30'); }
  document.getElementById('slots-grid').innerHTML = slots.map(t => {
    const busy = BUSY_SLOTS.includes(t);
    const sel = state.time === t;
    return `<div class="slot${busy?' slot--busy':sel?' slot--selected':''}"${!busy?` onclick="selectSlot('${t}',this)"`:''}>${t}</div>`;
  }).join('');
}

function selectSlot(t, el) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('slot--selected'));
  el.classList.add('slot--selected');
  state.time = t;
  setTimeout(() => { state.step = 4; renderBookingStep(); }, 150);
}

function updateSummary() {
  document.getElementById('sum-svc').textContent = state.service || '—';
  document.getElementById('sum-master').textContent = state.master || '—';
  document.getElementById('sum-date').textContent = state.date || '—';
  document.getElementById('sum-time').textContent = state.time || '—';
  document.getElementById('sum-price').textContent = state.price ? state.price + ' тг' : '—';
}

function confirmBooking() {
  const name = document.getElementById('inp-name').value.trim();
  const phone = document.getElementById('inp-phone').value.trim();
  if (!name) { alert('Введите имя'); return; }
  if (!phone) { alert('Введите телефон'); return; }
  // Save booking
  const bookings = getBookings();
  bookings.push({
    id: Date.now(),
    client: name, phone,
    service: state.service, master: state.master,
    date: state.date, time: state.time,
    status: 'new'
  });
  saveBookings(bookings);
  state.step = 5; renderBookingStep();
  document.getElementById('success-text').textContent =
    `${name}, ваша запись к мастеру ${state.master||'—'} на ${state.date} в ${state.time} подтверждена. Напоминание придёт за 1 час до визита.`;
}

function pad(n) { return n < 10 ? '0'+n : ''+n; }