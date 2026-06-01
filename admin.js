// =============================================
// ONEVAKZ — admin.js
// =============================================

const ADMIN_CREDS = { login: 'admin', pass: 'onevakz2025' };

// ============ AUTH ============
function adminLogin() {
  const login = document.getElementById('adm-login').value.trim();
  const pass = document.getElementById('adm-pass').value;
  if (login === ADMIN_CREDS.login && pass === ADMIN_CREDS.pass) {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';
    initAdmin();
  } else {
    document.getElementById('login-error').textContent = 'Неверный логин или пароль';
  }
}

function adminLogout() {
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('adm-login').value = '';
  document.getElementById('adm-pass').value = '';
}

// ============ INIT ============
function initAdmin() {
  const now = new Date();
  document.getElementById('adm-date').textContent =
    now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  updateStats();
  renderDashBookings();
  renderMastersAdmin();
  renderBookingsAdmin();
  renderServicesAdmin();
  populateBookingSelects();
  adminTab('dashboard');
}

function updateStats() {
  const masters = getMasters();
  const bookings = getBookings();
  const today = new Date().toLocaleDateString('ru-RU');
  document.getElementById('st-masters').textContent = masters.length;
  document.getElementById('st-bookings').textContent = bookings.filter(b => {
    // rough today check
    return b.date.includes(new Date().getDate()+'');
  }).length;
  document.getElementById('st-total').textContent = bookings.length;
  let total = 0;
  Object.values(SERVICES_DATA).forEach(c => total += c.items.length);
  document.getElementById('st-services').textContent = total;
}

// ============ TABS ============
function adminTab(name) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector(`[data-tab="${name}"]`).classList.add('active');
}

// ============ MODALS ============
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

// ============ DASHBOARD BOOKINGS ============
function renderDashBookings() {
  const bookings = getBookings().slice(0, 10);
  const tbody = document.getElementById('dash-bookings-body');
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.client}</td>
      <td>${b.service}</td>
      <td>${b.master}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td><span class="status-badge status-${b.status}">${statusLabel(b.status)}</span></td>
    </tr>
  `).join('');
}

// ============ MASTERS ============
function renderMastersAdmin() {
  const masters = getMasters();
  const grid = document.getElementById('masters-adm-grid');
  grid.innerHTML = masters.map(m => `
    <div class="master-adm-card">
      <div class="master-adm-card__top">
        <div class="master-adm-avatar">${m.photo ? `<img src="${m.photo}" alt="${m.name}"/>` : m.initials}</div>
        <div>
          <div class="master-adm-card__name">${m.name}</div>
          <div class="master-adm-card__spec">${m.spec}</div>
          <div class="master-adm-card__phone">${m.phone}</div>
        </div>
      </div>
      <div class="master-adm-card__cats">${(m.services||[]).map(s=>
        `<span class="cat-chip">${SERVICES_DATA[s]?.label||s}</span>`).join('')}
      </div>
      <div class="master-adm-card__desc">${m.desc||''}</div>
      <div class="master-adm-card__actions">
        <button class="btn-sm" onclick="editMaster(${m.id})">Редактировать</button>
        <button class="btn-sm btn-sm--danger" onclick="deleteMaster(${m.id})">Удалить</button>
      </div>
    </div>
  `).join('');
  // update master filter in bookings
  const sel = document.getElementById('booking-master-filter');
  if (sel) {
    const curr = sel.value;
    sel.innerHTML = '<option value="">Все мастера</option>' +
      masters.map(m => `<option value="${m.name}"${m.name===curr?' selected':''}>${m.name}</option>`).join('');
  }
}

function openMasterModal(master) {
  document.getElementById('master-modal-title').textContent = master ? 'Редактировать мастера' : 'Добавить мастера';
  document.getElementById('edit-master-id').value = master ? master.id : '';
  document.getElementById('m-name').value = master ? master.name : '';
  document.getElementById('m-spec').value = master ? master.spec : '';
  document.getElementById('m-phone').value = master ? master.phone : '';
  document.getElementById('m-desc').value = master ? master.desc : '';
  document.getElementById('m-photo').value = master ? (master.photo||'') : '';
  const prev = document.getElementById('photo-preview');
  prev.innerHTML = master && master.photo ? `<img src="${master.photo}" style="max-width:100%;border-radius:8px"/>` : '<span>Нет фото</span>';

  // render service checkboxes
  const checksEl = document.getElementById('master-services-check');
  checksEl.innerHTML = Object.entries(SERVICES_DATA).map(([key, cat]) =>
    `<label class="check-label">
      <input type="checkbox" value="${key}" ${master && master.services.includes(key) ? 'checked' : ''}/>
      ${cat.label}
    </label>`
  ).join('');
  openModal('master-modal');
}

function editMaster(id) {
  const master = getMasters().find(m => m.id === id);
  if (master) openMasterModal(master);
}

function saveMaster() {
  const id = document.getElementById('edit-master-id').value;
  const name = document.getElementById('m-name').value.trim();
  const spec = document.getElementById('m-spec').value.trim();
  const phone = document.getElementById('m-phone').value.trim();
  const desc = document.getElementById('m-desc').value.trim();
  const photo = document.getElementById('m-photo').value.trim();
  const services = [...document.querySelectorAll('#master-services-check input:checked')].map(c => c.value);

  if (!name) { alert('Введите имя мастера'); return; }
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  let masters = getMasters();
  if (id) {
    masters = masters.map(m => m.id == id ? { ...m, name, spec, phone, desc, photo, services, initials } : m);
  } else {
    const newId = Date.now();
    masters.push({ id: newId, name, spec, phone, desc, photo, services, initials });
  }
  saveMasters(masters);
  closeModal('master-modal');
  renderMastersAdmin();
  updateStats();
}

function deleteMaster(id) {
  if (!confirm('Удалить мастера?')) return;
  const masters = getMasters().filter(m => m.id !== id);
  saveMasters(masters);
  renderMastersAdmin();
  updateStats();
}

function previewPhoto(url) {
  const prev = document.getElementById('photo-preview');
  if (url) prev.innerHTML = `<img src="${url}" style="max-width:100%;border-radius:8px;margin-top:8px" onerror="this.style.display='none'"/>`;
  else prev.innerHTML = '<span>Нет фото</span>';
}

function handlePhotoFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('m-photo').value = e.target.result;
    document.getElementById('photo-preview').innerHTML = `<img src="${e.target.result}" style="max-width:100%;border-radius:8px;margin-top:8px"/>`;
  };
  reader.readAsDataURL(file);
}

// ============ BOOKINGS ============
let bookingFilter = { text: '', master: '' };

function renderBookingsAdmin(filter) {
  let bookings = getBookings();
  if (bookingFilter.text) {
    const q = bookingFilter.text.toLowerCase();
    bookings = bookings.filter(b => b.client.toLowerCase().includes(q) || b.service.toLowerCase().includes(q));
  }
  if (bookingFilter.master) bookings = bookings.filter(b => b.master === bookingFilter.master);

  const tbody = document.getElementById('bookings-body');
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.client}</td>
      <td>${b.phone||'—'}</td>
      <td>${b.service}</td>
      <td>${b.master}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td>
        <select class="status-select status-${b.status}" onchange="changeBookingStatus(${b.id}, this.value)">
          <option value="new"${b.status==='new'?' selected':''}>Новая</option>
          <option value="confirmed"${b.status==='confirmed'?' selected':''}>Подтверждена</option>
          <option value="done"${b.status==='done'?' selected':''}>Выполнена</option>
          <option value="cancelled"${b.status==='cancelled'?' selected':''}>Отменена</option>
        </select>
      </td>
      <td>
        <button class="btn-sm" onclick="editBooking(${b.id})">Ред.</button>
        <button class="btn-sm btn-sm--danger" onclick="deleteBooking(${b.id})">✕</button>
      </td>
    </tr>
  `).join('');
}

function filterBookings(val) {
  bookingFilter.text = val;
  renderBookingsAdmin();
}

function filterBookingsMaster(val) {
  bookingFilter.master = val;
  renderBookingsAdmin();
}

function changeBookingStatus(id, status) {
  const bookings = getBookings().map(b => b.id === id ? { ...b, status } : b);
  saveBookings(bookings);
  renderDashBookings();
}

function openAddBookingModal() {
  document.getElementById('booking-modal-title').textContent = 'Добавить запись';
  document.getElementById('edit-booking-id').value = '';
  document.getElementById('b-client').value = '';
  document.getElementById('b-phone').value = '';
  document.getElementById('b-service').value = '';
  document.getElementById('b-master').value = '';
  document.getElementById('b-date').value = '';
  document.getElementById('b-status').value = 'new';
  openModal('add-booking-modal');
}

function editBooking(id) {
  const b = getBookings().find(b => b.id === id);
  if (!b) return;
  document.getElementById('booking-modal-title').textContent = 'Редактировать запись';
  document.getElementById('edit-booking-id').value = b.id;
  document.getElementById('b-client').value = b.client;
  document.getElementById('b-phone').value = b.phone || '';
  document.getElementById('b-service').value = b.service;
  document.getElementById('b-master').value = b.master;
  document.getElementById('b-date').value = '';
  document.getElementById('b-time').value = b.time;
  document.getElementById('b-status').value = b.status;
  openModal('add-booking-modal');
}

function saveBooking() {
  const id = document.getElementById('edit-booking-id').value;
  const client = document.getElementById('b-client').value.trim();
  const phone = document.getElementById('b-phone').value.trim();
  const service = document.getElementById('b-service').value;
  const master = document.getElementById('b-master').value;
  const date = document.getElementById('b-date').value;
  const time = document.getElementById('b-time').value;
  const status = document.getElementById('b-status').value;

  if (!client || !service || !master) { alert('Заполните обязательные поля'); return; }

  let bookings = getBookings();
  if (id) {
    bookings = bookings.map(b => b.id == id ? { ...b, client, phone, service, master, date: date||b.date, time, status } : b);
  } else {
    bookings.push({ id: Date.now(), client, phone, service, master, date: date||'—', time, status });
  }
  saveBookings(bookings);
  closeModal('add-booking-modal');
  renderBookingsAdmin();
  renderDashBookings();
  updateStats();
}

function deleteBooking(id) {
  if (!confirm('Удалить запись?')) return;
  saveBookings(getBookings().filter(b => b.id !== id));
  renderBookingsAdmin();
  renderDashBookings();
  updateStats();
}

function populateBookingSelects() {
  const svcSel = document.getElementById('b-service');
  const masterSel = document.getElementById('b-master');
  Object.values(SERVICES_DATA).forEach(cat => {
    cat.items.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name; opt.textContent = s.name;
      svcSel.appendChild(opt);
    });
  });
  getMasters().forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.name; opt.textContent = m.name;
    masterSel.appendChild(opt);
  });
}

// ============ SERVICES TABLE ============
function renderServicesAdmin() {
  const tbody = document.getElementById('services-body');
  let rows = '';
  Object.entries(SERVICES_DATA).forEach(([key, cat]) => {
    cat.items.forEach((s, i) => {
      rows += `<tr>
        ${i===0?`<td rowspan="${cat.items.length}" class="cat-cell">${cat.label}</td>`:''}
        <td>${s.name}</td>
        <td>${s.dur}</td>
        <td>${s.price} тг</td>
      </tr>`;
    });
  });
  tbody.innerHTML = rows;
}

function statusLabel(s) {
  return { new:'Новая', confirmed:'Подтверждена', done:'Выполнена', cancelled:'Отменена' }[s] || s;
}