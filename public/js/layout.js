let cachedSettings = null;

const NAV_LINKS = [
  { href: '/about.html', label: 'About Us' },
  { href: '/fleet.html', label: 'Showroom' },
  { href: '/services.html', label: 'Services' },
  { href: '/contact.html', label: 'Location' }
];

function brandHtml(name) {
  const n = name || 'Mekit Car Rentals';
  if (n.toLowerCase().includes('mekit')) {
    return `<span class="brand-icon">🚗</span> Mekit <span>Car Rentals</span>`;
  }
  const parts = n.trim().split(/\s+/);
  const first = parts[0] || 'Mekit';
  const rest = parts.slice(1).join(' ') || 'Car Rentals';
  return `<span class="brand-icon">🚗</span> ${first} <span>${rest}</span>`;
}

function isActive(href) {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const target = href.replace(/\/$/, '');
  if (target === '/about.html') return path.includes('about');
  return path === target || path.endsWith(target);
}

async function loadSettings(force = false) {
  if (cachedSettings && !force) return cachedSettings;
  cachedSettings = await api('/api/settings');
  return cachedSettings;
}

function renderHeader(options = {}) {
  const { active = '', variant = 'light' } = options;
  const settings = cachedSettings || {};
  const dark = variant === 'dark';

  const navItems = NAV_LINKS.map((link) => {
    const activeClass = (active === link.label || isActive(link.href)) ? ' active' : '';
    return `<a href="${link.href}" class="nav-link${activeClass}">${link.label}</a>`;
  }).join('');

  return `
    <header class="site-header${dark ? ' header-dark' : ''}">
      <div class="header-inner">
        <a href="/" class="brand" id="site-brand">${brandHtml(settings.company_name)}</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" id="site-nav">${navItems}</nav>
        <div class="header-actions">
          <a href="/contact.html" class="btn btn-primary btn-sm">Contact Us</a>
        </div>
      </div>
    </header>`;
}

function renderFooter() {
  const settings = cachedSettings || {};
  const phone = settings.phone || '08139723327';
  const email = settings.email || 'info@mekitcarrentals.com';

  return `
    <footer class="site-footer">
      <div class="footer-top">
        <a href="/" class="brand">${brandHtml(settings.company_name)}</a>
        <nav class="footer-nav">
          <a href="/about.html">About Us</a>
          <a href="/fleet.html">Showroom</a>
          <a href="/services.html">Services</a>
          <a href="/contact.html">Contact Us</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${settings.company_name || 'Mekit Car Rentals'}. All rights reserved.</p>
        <div class="footer-social">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="Twitter">x</a>
        </div>
        <div class="footer-contact">
          <a href="tel:${phone}">${phone}</a><br>
          <a href="mailto:${email}">${email}</a>
        </div>
      </div>
    </footer>`;
}

function mountLayout(options = {}) {
  const headerMount = document.getElementById('site-header-mount');
  const footerMount = document.getElementById('site-footer-mount');
  if (headerMount) headerMount.innerHTML = renderHeader(options);
  if (footerMount) footerMount.innerHTML = renderFooter();

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav?.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

async function initPage(options = {}) {
  await loadSettings();
  mountLayout(options);
  if (options.title) {
    document.title = `${options.title} — ${cachedSettings.company_name}`;
  }
  return cachedSettings;
}

async function rentCar(carId, btn) {
  const original = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Opening…';
  }
  try {
    const result = await api('/api/car-interest', {
      method: 'POST',
      body: { car_id: Number(carId) }
    });
    window.open(result.whatsappUrl, '_blank');
    return result;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = original || 'Rent Now';
    }
  }
}

async function submitWhatsAppForm(endpoint, body, btn, successMsg) {
  const alertEl = document.getElementById('form-alert');
  if (alertEl) alertEl.className = 'hidden';

  const original = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Opening…';
  }

  try {
    const result = await api(endpoint, { method: 'POST', body });
    window.open(result.whatsappUrl, '_blank');
    if (alertEl) {
      alertEl.className = 'alert alert-success';
      alertEl.textContent = successMsg || 'Your message is ready — tap send in WhatsApp.';
      alertEl.classList.remove('hidden');
    }
    return result;
  } catch (err) {
    if (alertEl) {
      alertEl.className = 'alert alert-error';
      alertEl.textContent = err.message;
      alertEl.classList.remove('hidden');
    }
    throw err;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = original;
    }
  }
}

function renderCarCard(car) {
  const sold = car.status === 'sold';
  const fav = isFavourite(car.id);
  const spec = [car.fuel, car.transmission].filter(Boolean).join(' · ') || `${car.body_type} · ${car.year}`;
  const colors = ['#EF4444', '#1A1A1A', '#3B82F6', '#FFFFFF'];

  return `
    <article class="inventory-card">
      <a href="/car.html?id=${car.id}" class="inventory-card-link">
        <div class="inventory-card-img">
          ${sold ? '<span class="badge-sold">Sold</span>' : ''}
          <button type="button" class="fav-btn ${fav ? 'active' : ''}" data-id="${car.id}" aria-label="Save">${fav ? '♥' : '♡'}</button>
          ${imgHtml(car.images[0], car.title)}
        </div>
        <div class="inventory-card-body">
          <h3 class="inventory-card-title">${car.title}</h3>
          <p class="inventory-card-spec">${spec}</p>
          <div class="color-dots">${colors.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
          <p class="inventory-card-price"><em>Price:</em> ${formatPrice(car.price)}</p>
        </div>
      </a>
      <button type="button" class="btn btn-rent rent-btn" data-car-id="${car.id}">Rent Now</button>
    </article>`;
}

function bindCarCards(root = document) {
  root.querySelectorAll('.fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const on = toggleFavourite(id);
      btn.textContent = on ? '♥' : '♡';
      btn.classList.toggle('active', on);
      if (typeof updateFavBanner === 'function') updateFavBanner();
    });
  });

  root.querySelectorAll('.rent-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      rentCar(btn.dataset.carId, btn);
    });
  });
}
