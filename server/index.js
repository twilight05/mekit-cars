const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { db, parseCar } = require('./db');
const { signToken, authMiddleware } = require('./auth');
const {
  buildWhatsAppUrl,
  absoluteListingUrl,
  buildCarInterestMessage,
  buildInquiryMessage,
  buildContactMessage
} = require('./whatsapp');

const PORT = process.env.PORT || 3000;
const app = express();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '..', 'public')));

const SETTINGS_FIELDS = 'company_name, location, whatsapp_number, tagline, email, phone, hero_text, about_text';

function getSettings() {
  return db.prepare(`SELECT ${SETTINGS_FIELDS} FROM settings WHERE id = 1`).get();
}

// ——— Auth ———
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json({
    token: signToken(user),
    user: { id: user.id, email: user.email }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ——— Settings ———
app.get('/api/settings', (_req, res) => {
  res.json(getSettings());
});

app.put('/api/settings', authMiddleware, (req, res) => {
  const {
    company_name, location, whatsapp_number,
    tagline, email, phone, hero_text, about_text
  } = req.body;
  db.prepare(
    `UPDATE settings SET
      company_name = COALESCE(?, company_name),
      location = COALESCE(?, location),
      whatsapp_number = COALESCE(?, whatsapp_number),
      tagline = COALESCE(?, tagline),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      hero_text = COALESCE(?, hero_text),
      about_text = COALESCE(?, about_text)
    WHERE id = 1`
  ).run(
    company_name ?? null, location ?? null, whatsapp_number ?? null,
    tagline ?? null, email ?? null, phone ?? null,
    hero_text ?? null, about_text ?? null
  );
  res.json(getSettings());
});

// ——— Cars (public list with filters) ———
app.get('/api/cars', (req, res) => {
  const {
    search = '',
    make = '',
    body_type = '',
    min_price = '',
    max_price = '',
    year = '',
    status = '',
    include_sold = 'false',
    limit = ''
  } = req.query;

  let sql = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (include_sold !== 'true') {
    sql += " AND status = 'available'";
  } else if (status === 'available' || status === 'sold') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (make) {
    sql += ' AND make = ?';
    params.push(make);
  }
  if (body_type) {
    sql += ' AND body_type = ?';
    params.push(body_type);
  }
  if (year) {
    sql += ' AND year = ?';
    params.push(Number(year));
  }
  if (min_price) {
    sql += ' AND price >= ?';
    params.push(Number(min_price));
  }
  if (max_price) {
    sql += ' AND price <= ?';
    params.push(Number(max_price));
  }
  if (search.trim()) {
    sql += ' AND (title LIKE ? OR make LIKE ? OR model LIKE ? OR description LIKE ?)';
    const q = `%${search.trim()}%`;
    params.push(q, q, q, q);
  }

  sql += ' ORDER BY created_at DESC';
  if (limit) {
    sql += ' LIMIT ?';
    params.push(Number(limit));
  }

  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(parseCar));
});

app.get('/api/cars/meta/filters', (_req, res) => {
  const makes = db.prepare('SELECT DISTINCT make FROM cars ORDER BY make').all().map((r) => r.make);
  const bodyTypes = db.prepare('SELECT DISTINCT body_type FROM cars ORDER BY body_type').all().map((r) => r.body_type);
  const years = db.prepare('SELECT DISTINCT year FROM cars ORDER BY year DESC').all().map((r) => r.year);
  const priceRow = db.prepare('SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM cars').get();
  const stats = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available
    FROM cars
  `).get();
  res.json({ makes, bodyTypes, years, ...priceRow, ...stats });
});

app.get('/api/cars/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Listing not found' });
  res.json(parseCar(row));
});

// ——— Admin cars CRUD ———
app.post('/api/cars', authMiddleware, (req, res) => {
  const {
    title, make, model, year, body_type, price, description,
    status = 'available', images = [], mileage, fuel, transmission
  } = req.body;

  if (!title || !make || !model || !year || !body_type || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = db.prepare(`
    INSERT INTO cars (title, make, model, year, body_type, price, description, status, images, mileage, fuel, transmission)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title, make, model, Number(year), body_type, Number(price),
    description || '', status, JSON.stringify(images),
    mileage ?? null, fuel ?? null, transmission ?? null
  );

  const car = parseCar(db.prepare('SELECT * FROM cars WHERE id = ?').get(result.lastInsertRowid));
  res.status(201).json(car);
});

app.put('/api/cars/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Listing not found' });

  const {
    title = existing.title,
    make = existing.make,
    model = existing.model,
    year = existing.year,
    body_type = existing.body_type,
    price = existing.price,
    description = existing.description,
    status = existing.status,
    images = JSON.parse(existing.images || '[]'),
    mileage = existing.mileage,
    fuel = existing.fuel,
    transmission = existing.transmission
  } = req.body;

  db.prepare(`
    UPDATE cars SET
      title = ?, make = ?, model = ?, year = ?, body_type = ?,
      price = ?, description = ?, status = ?, images = ?,
      mileage = ?, fuel = ?, transmission = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    title, make, model, Number(year), body_type, Number(price),
    description, status, JSON.stringify(images),
    mileage ?? null, fuel ?? null, transmission ?? null,
    req.params.id
  );

  res.json(parseCar(db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id)));
});

app.delete('/api/cars/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Listing not found' });
  res.json({ ok: true });
});

app.post('/api/cars/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// ——— Car interest → WhatsApp (when customer selects/views a vehicle) ———
app.post('/api/car-interest', (req, res) => {
  const { car_id } = req.body;
  if (!car_id) return res.status(400).json({ error: 'Vehicle ID is required' });

  const car = parseCar(db.prepare('SELECT * FROM cars WHERE id = ?').get(car_id));
  if (!car) return res.status(404).json({ error: 'Listing not found' });

  const settings = getSettings();
  db.prepare('INSERT INTO car_interests (car_id) VALUES (?)').run(car_id);

  const listingUrl = absoluteListingUrl(req, car_id);
  const text = buildCarInterestMessage(car, settings, listingUrl);
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, text);

  res.json({ ok: true, whatsappUrl, message: text });
});

// ——— Inquiry form → WhatsApp ———
app.post('/api/inquiries', (req, res) => {
  const { car_id, name, phone, dates, message } = req.body;
  if (!car_id || !name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Vehicle, name, and phone are required' });
  }

  const car = parseCar(db.prepare('SELECT * FROM cars WHERE id = ?').get(car_id));
  if (!car) return res.status(404).json({ error: 'Listing not found' });

  const settings = getSettings();

  db.prepare(
    'INSERT INTO inquiries (car_id, name, phone, dates, message) VALUES (?, ?, ?, ?, ?)'
  ).run(car_id, name.trim(), phone.trim(), dates || '', message || '');

  const listingUrl = absoluteListingUrl(req, car_id);
  const text = buildInquiryMessage(car, settings, listingUrl, { name, phone, dates, message });
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, text);

  res.json({ ok: true, whatsappUrl, message: text });
});

// ——— Contact form → WhatsApp ———
app.post('/api/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const settings = getSettings();

  db.prepare(
    'INSERT INTO contact_messages (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)'
  ).run(name.trim(), phone.trim(), email || '', subject || '', message || '');

  const text = buildContactMessage(settings, { name, phone, email, subject, message });
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, text);

  res.json({ ok: true, whatsappUrl, message: text });
});

// ——— Admin stats ———
app.get('/api/admin/stats', authMiddleware, (_req, res) => {
  const cars = db.prepare('SELECT COUNT(*) AS total FROM cars').get().total;
  const inquiries = db.prepare('SELECT COUNT(*) AS total FROM inquiries').get().total;
  const contacts = db.prepare('SELECT COUNT(*) AS total FROM contact_messages').get().total;
  const interests = db.prepare('SELECT COUNT(*) AS total FROM car_interests').get().total;
  res.json({ cars, inquiries, contacts, interests });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Mekit Car Rentals running at http://localhost:${PORT}`);
  console.log(`Admin login: admin@company.com / admin123`);
  console.log(`WhatsApp inquiries go to: 08139723327`);
});
