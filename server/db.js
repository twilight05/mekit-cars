const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'cars.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    company_name TEXT DEFAULT 'Mekit Car Rentals',
    location TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '2348139723327',
    tagline TEXT DEFAULT 'Premium vehicle hire & sales',
    email TEXT DEFAULT 'info@mekitcarrentals.com',
    phone TEXT DEFAULT '08139723327',
    hero_text TEXT DEFAULT 'Premium vehicles for weddings, events, corporate travel, and daily hire across Nigeria.',
    about_text TEXT DEFAULT 'Mekit Car Rentals provides executive transport and vehicle hire for weddings, corporate events, airport transfers, and special occasions across Nigeria.'
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    body_type TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
    images TEXT DEFAULT '[]',
    mileage INTEGER,
    fuel TEXT,
    transmission TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    dates TEXT,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
  );
`);

function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn('settings', 'tagline', "TEXT DEFAULT 'Premium vehicle hire & sales'");
ensureColumn('settings', 'email', "TEXT DEFAULT ''");
ensureColumn('settings', 'phone', "TEXT DEFAULT ''");
ensureColumn('settings', 'hero_text', "TEXT DEFAULT ''");
ensureColumn('settings', 'about_text', "TEXT DEFAULT ''");

const settingsCount = db.prepare('SELECT COUNT(*) AS c FROM settings').get().c;
if (settingsCount === 0) {
  db.prepare(
    `INSERT INTO settings (id, company_name, location, whatsapp_number, tagline, email, phone, hero_text, about_text)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'Mekit Car Rentals',
    'Lagos, Nigeria',
    '2348139723327',
    'Premium vehicle hire & sales',
    'info@mekitcarrentals.com',
    '08139723327',
    'Premium vehicles for weddings, events, corporate travel, and daily hire across Nigeria.',
    'Mekit Car Rentals provides executive transport and vehicle hire for weddings, corporate events, airport transfers, and special occasions across Nigeria.'
  );
} else {
  db.prepare(`UPDATE settings SET company_name = 'Mekit Car Rentals' WHERE id = 1 AND company_name = 'Premier Auto Rentals'`).run();
  db.prepare(
    `UPDATE settings SET whatsapp_number = '2348139723327'
     WHERE id = 1 AND (whatsapp_number = '2348012345678' OR whatsapp_number = '15551234567')`
  ).run();
  db.prepare(
    `UPDATE settings SET phone = '08139723327', email = 'info@premierauto.ng'
     WHERE id = 1 AND (phone IS NULL OR phone = '')`
  ).run();
}

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS car_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
  );
`);

const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (userCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(
    'admin@company.com',
    hash
  );
}

const carCount = db.prepare('SELECT COUNT(*) AS c FROM cars').get().c;
if (carCount === 0) {
  const seedCars = [
    {
      title: '2022 Mercedes-Benz S-Class Limo',
      make: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2022,
      body_type: 'Limo',
      price: 450000,
      description:
        'Executive stretch limousine perfect for weddings, corporate events, and VIP airport transfers. Leather interior, climate control, premium sound system, and professional chauffeur-ready configuration.',
      status: 'available',
      images: JSON.stringify(['/images/fleet/limo.jpg']),
      mileage: 12000,
      fuel: 'Petrol',
      transmission: 'Automatic'
    },
    {
      title: '2021 Toyota Camry — Executive Sedan',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      body_type: 'Sedan',
      price: 85000,
      description:
        'Reliable executive sedan for business travel and daily hire. Fuel-efficient, comfortable seating for 5, and well maintained.',
      status: 'available',
      images: JSON.stringify(['/images/fleet/sedan.jpg']),
      mileage: 28000,
      fuel: 'Petrol',
      transmission: 'Automatic'
    },
    {
      title: '2023 Range Rover Sport SUV',
      make: 'Land Rover',
      model: 'Range Rover Sport',
      year: 2023,
      body_type: 'SUV',
      price: 320000,
      description:
        'Premium SUV for events, road trips, and luxury transfers. All-wheel drive, panoramic roof, and spacious cargo area.',
      status: 'available',
      images: JSON.stringify(['/images/fleet/suv.jpg']),
      mileage: 8000,
      fuel: 'Petrol',
      transmission: 'Automatic'
    },
    {
      title: '2020 Ford F-150 Pickup',
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      body_type: 'Truck',
      price: 120000,
      description:
        'Heavy-duty pickup for logistics, construction site visits, and cargo transport. Sold recently — shown as example inventory status.',
      status: 'sold',
      images: JSON.stringify(['/images/fleet/truck.jpg']),
      mileage: 45000,
      fuel: 'Petrol',
      transmission: 'Automatic'
    }
  ];

  const insert = db.prepare(`
    INSERT INTO cars (title, make, model, year, body_type, price, description, status, images, mileage, fuel, transmission)
    VALUES (@title, @make, @model, @year, @body_type, @price, @description, @status, @images, @mileage, @fuel, @transmission)
  `);

  for (const car of seedCars) insert.run(car);
}

const FLEET_IMAGES_BY_BODY = {
  Limo: '/images/fleet/limo.jpg',
  Sedan: '/images/fleet/sedan.jpg',
  SUV: '/images/fleet/suv.jpg',
  Truck: '/images/fleet/truck.jpg'
};

const CAR_IMAGES_BY_TITLE = {
  '2022 Mercedes-Benz S-Class Limo': ['/images/fleet/limo.jpg'],
  '2021 Toyota Camry — Executive Sedan': ['/images/fleet/sedan.jpg'],
  '2023 Range Rover Sport SUV': ['/images/fleet/suv.jpg'],
  '2020 Ford F-150 Pickup': ['/images/fleet/truck.jpg']
};

function fleetImageFor(bodyType) {
  return FLEET_IMAGES_BY_BODY[bodyType] ? [FLEET_IMAGES_BY_BODY[bodyType]] : ['/images/fleet/sedan.jpg'];
}

function needsImageMigration(imgs) {
  if (!imgs.length) return true;
  return imgs.some((u) => typeof u === 'string' && (
    u.includes('unsplash.com') ||
    u.includes('/images/hero.png') ||
    u.includes('/images/hero.jpg') ||
    u.includes('placeholder') ||
    u.includes('/images/limo') ||
    u.includes('/images/sedan') ||
    u.includes('/images/suv') ||
    u.includes('/images/truck')
  ));
}

function migrateBrokenImages() {
  const rows = db.prepare('SELECT id, title, body_type, images FROM cars').all();
  const update = db.prepare('UPDATE cars SET images = ? WHERE id = ?');
  for (const row of rows) {
    let imgs = [];
    try {
      imgs = JSON.parse(row.images || '[]');
    } catch {
      imgs = [];
    }
    if (!needsImageMigration(imgs)) continue;

    const replacement =
      CAR_IMAGES_BY_TITLE[row.title] ||
      fleetImageFor(row.body_type);

    update.run(JSON.stringify(replacement), row.id);
  }
}

migrateBrokenImages();

function parseCar(row) {
  if (!row) return null;
  return {
    ...row,
    images: JSON.parse(row.images || '[]'),
    price: Number(row.price)
  };
}

module.exports = { db, parseCar };
