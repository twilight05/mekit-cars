const API_BASE = window.location.origin;
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  const token = localStorage.getItem('admin_token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function formatPrice(n) {
  return `₦${Number(n).toLocaleString()}`;
}

function imageUrl(path) {
  if (!path) return PLACEHOLDER_IMAGE;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/${path.replace(/^\//, '')}`;
}

function imgHtml(src, alt, extraClass = '') {
  const url = imageUrl(src);
  const cls = extraClass ? ` class="${extraClass}"` : '';
  return `<img src="${url}" alt="${alt.replace(/"/g, '&quot;')}"${cls} loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}'">`;
}

function bindImageFallbacks(root = document) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.src !== PLACEHOLDER_IMAGE) img.src = PLACEHOLDER_IMAGE;
    });
  });
}

const FAV_KEY = 'car_favourites';

function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch {
    return [];
  }
}

function toggleFavourite(id) {
  const favs = getFavourites();
  const n = Number(id);
  const idx = favs.indexOf(n);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(n);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs.includes(n);
}

function isFavourite(id) {
  return getFavourites().includes(Number(id));
}
