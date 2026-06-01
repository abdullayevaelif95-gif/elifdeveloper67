// =============================================
// ONEVAKZ — data.js  (shared between site & admin)
// =============================================

// ---- MASTERS ----
const MASTERS_DEFAULT = [
  {
    id: 1,
    name: 'Айгерим С.',
    spec: 'Парикмахер',
    phone: '+7 (700) 111-11-11',
    desc: 'Специалист по стрижкам и укладкам. Опыт 7 лет.',
    photo: '',
    initials: 'АС',
    services: ['hair-cut', 'styling'],
  },
  {
    id: 2,
    name: 'Дана М.',
    spec: 'Колорист',
    phone: '+7 (700) 222-22-22',
    desc: 'Мастер окрашивания и ухода за волосами. Опыт 5 лет.',
    photo: '',
    initials: 'ДМ',
    services: ['color', 'care', 'wash'],
  },
  {
    id: 3,
    name: 'Мадина Т.',
    spec: 'Мастер ногтевого сервиса',
    phone: '+7 (700) 333-33-33',
    desc: 'Маникюр, педикюр, дизайн ногтей. Опыт 4 года.',
    photo: '',
    initials: 'МТ',
    services: ['nails'],
  },
  {
    id: 4,
    name: 'Жанна К.',
    spec: 'Стилист',
    phone: '+7 (700) 444-44-44',
    desc: 'Укладки, свадебные прически, стрижки. Опыт 6 лет.',
    photo: '',
    initials: 'ЖК',
    services: ['styling', 'hair-cut'],
  },
];

// ---- SERVICES ----
const SERVICES_DATA = {
  'hair-cut': {
    label: 'Стрижки',
    items: [
      { name: 'Стрижка женская — средние волосы', dur: '50 мин', price: '5 000 – 20 000' },
      { name: 'Стрижка женская — длинные волосы', dur: '50 мин', price: '6 000 – 20 000' },
      { name: 'Детская стрижка', dur: '40 мин', price: '3 000 – 5 000' },
      { name: 'Полировка волос', dur: '1 час', price: '5 000 – 10 000' },
      { name: 'Стрижка чёлки', dur: '30 мин', price: '1 000 – 2 000' },
    ],
  },
  'styling': {
    label: 'Укладка',
    items: [
      { name: 'Укладка женская', dur: '1 час', price: '5 000 – 10 000' },
      { name: 'Брашинг', dur: '50 мин', price: '5 000 – 10 000' },
      { name: 'Прическа женская', dur: '1 час', price: '5 000 – 10 000' },
      { name: 'Прическа детская', dur: '1 час', price: '3 000 – 4 000' },
      { name: 'Свадебная прическа', dur: '1 час', price: '8 000 – 10 000' },
      { name: 'Хим.завивка / кератиновое выпрямление', dur: '2 часа', price: 'от 10 000' },
      { name: 'Хим / био завивка', dur: '2 часа', price: 'от 10 000' },
    ],
  },
  'color': {
    label: 'Окрашивание',
    items: [
      { name: 'Сложное окрашивание', dur: '4 часа', price: '35 000 – 150 000' },
      { name: 'Окрашивание в один тон', dur: '2 часа', price: '12 000 – 35 000' },
      { name: 'Осветление маслом', dur: '2 часа', price: '25 000 – 85 000' },
      { name: 'Окрашивание маслом', dur: '3 часа', price: '35 000 – 100 000' },
      { name: 'Тонировка волос', dur: '1 ч 30 мин', price: '20 000 – 30 000' },
    ],
  },
  'care': {
    label: 'Уход за волосами',
    items: [
      { name: 'Нанопластика волос', dur: '3 часа', price: '25 000 – 100 000' },
      { name: 'Биопластика', dur: '3 часа', price: '25 000 – 100 000' },
      { name: 'Кератин + ботокс', dur: '3 часа', price: '20 000 – 100 000' },
      { name: 'Ботокс', dur: '3 часа', price: '20 000 – 100 000' },
      { name: 'Пилинг головы', dur: '1 час', price: '5 000 – 10 000' },
      { name: 'Лазерная кристаллизация', dur: '3 часа', price: '50 000 – 150 000' },
      { name: 'Наноквертизация', dur: '3 часа', price: '30 000 – 100 000' },
      { name: 'Восстановление волос', dur: '1 ч 30 мин', price: '25 000 – 50 000' },
      { name: 'TOKIO INKARAMI — длинные', dur: '2 ч 30 мин', price: '70 000 – 100 000' },
      { name: 'TOKIO INKARAMI — средняя длина', dur: '2 ч 30 мин', price: '50 000 – 80 000' },
      { name: 'TOKIO INKARAMI — короткие', dur: '2 ч 30 мин', price: '45 000 – 60 000' },
      { name: 'Восстановление TOKIO INKARAMI', dur: '2 ч 30 мин', price: '50 000 – 80 000' },
      { name: 'Уход TOKIO INKARAMI', dur: '2 ч 30 мин', price: '50 000 – 80 000' },
      { name: 'Уход Tokio Spa / INKARAMI', dur: '2 ч 30 мин', price: '50 000 – 80 000' },
    ],
  },
  'nails': {
    label: 'Ногтевой сервис',
    items: [
      { name: 'Маникюр классический', dur: '45 мин', price: '3 000 – 3 500' },
      { name: 'Маникюр классический + лак', dur: '45 мин', price: '3 000 – 3 500' },
      { name: 'Покрытие обычным лаком', dur: '—', price: '500 – 1 000' },
      { name: 'Маникюр гель-покрытие', dur: '2 часа', price: '6 000 – 7 000' },
      { name: 'Дизайн ногтей', dur: '15 мин', price: '1 000' },
      { name: 'Уход за ногтями', dur: '10 мин', price: '500 – 1 000' },
      { name: 'Педикюр классический', dur: '1 час', price: '6 000' },
      { name: 'Педикюр + гель-покрытие', dur: '1 ч 30 мин', price: '7 000' },
      { name: 'SMART педикюр', dur: '1 час', price: '7 000 – 9 000' },
      { name: 'SMART педикюр + гель-покрытие', dur: '2 часа', price: '8 000' },
      { name: 'Снятие гель-покрытия', dur: '30 мин', price: '1 000 – 2 000' },
    ],
  },
  'wash': {
    label: 'Мытьё и сушка',
    items: [
      { name: 'Мытьё волос', dur: '40 мин', price: '2 000 – 3 000' },
    ],
  },
};

// ---- BOOKINGS ----
const BOOKINGS_DEFAULT = [
  { id: 1, client: 'Айгуль Б.', phone: '+7 701 000 0001', service: 'Стрижка женская — средние волосы', master: 'Айгерим С.', date: '2 июня', time: '10:00', status: 'confirmed' },
  { id: 2, client: 'Зарина М.', phone: '+7 701 000 0002', service: 'Маникюр гель-покрытие', master: 'Мадина Т.', date: '2 июня', time: '11:00', status: 'new' },
  { id: 3, client: 'Диана Н.', phone: '+7 701 000 0003', service: 'Окрашивание в один тон', master: 'Дана М.', date: '3 июня', time: '12:00', status: 'new' },
  { id: 4, client: 'Камила С.', phone: '+7 701 000 0004', service: 'Свадебная прическа', master: 'Жанна К.', date: '4 июня', time: '14:00', status: 'confirmed' },
  { id: 5, client: 'Нуржан А.', phone: '+7 701 000 0005', service: 'Педикюр классический', master: 'Мадина Т.', date: '5 июня', time: '15:30', status: 'done' },
];

// ---- STORAGE HELPERS ----
function getMasters() {
  try {
    const raw = localStorage.getItem('onevakz_masters');
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(MASTERS_DEFAULT));
  } catch(e) { return JSON.parse(JSON.stringify(MASTERS_DEFAULT)); }
}

function saveMasters(data) {
  localStorage.setItem('onevakz_masters', JSON.stringify(data));
}

function getBookings() {
  try {
    const raw = localStorage.getItem('onevakz_bookings');
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(BOOKINGS_DEFAULT));
  } catch(e) { return JSON.parse(JSON.stringify(BOOKINGS_DEFAULT)); }
}

function saveBookings(data) {
  localStorage.setItem('onevakz_bookings', JSON.stringify(data));
}