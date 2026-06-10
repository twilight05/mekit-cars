# Car Listing Platform (MVP)

Single-company vehicle listing site from the PRD. Visitors browse inventory, open product pages, and submit inquiries that open **WhatsApp** with a pre-filled message for the owner. Staff use an admin dashboard to manage listings.

## Quick start

```bash
npm install
npm start
```

Open **http://localhost:3000**

| Page | URL |
|------|-----|
| Public catalog | http://localhost:3000 |
| Product / inquiry | http://localhost:3000/car.html?id=1 |
| Staff login | http://localhost:3000/login.html |
| Admin dashboard | http://localhost:3000/admin.html |

### Default admin credentials

- **Email:** `admin@company.com`
- **Password:** `admin123`

Change these in production. Set `JWT_SECRET` in the environment for deployed servers.

## Features

- **Listings grid** with search and filters (make, body type, year, price)
- **Product page** with photo gallery, specs, and inquiry form
- **WhatsApp delivery** — submit opens `wa.me` with formatted inquiry (no Business API required for MVP)
- **Admin** — CRUD listings, photo upload, sold/available status
- **Settings** — company name, location, owner WhatsApp number
- **Sold badge** and optional “show sold” filter
- **Share** button (native Web Share API where supported)
- **Favourites** stored in browser local storage

## API (localhost)

Backend runs on the same port as the static site (`3000` by default).

- `GET /api/cars` — public listings (query: `search`, `make`, `body_type`, `year`, `min_price`, `max_price`, `include_sold`)
- `GET /api/cars/:id` — single listing
- `POST /api/inquiries` — create inquiry, returns `{ whatsappUrl }`
- `GET /api/settings` — public business info
- `POST /api/auth/login` — staff JWT
- `POST/PUT/DELETE /api/cars` — admin (Bearer token)
- `PUT /api/settings` — admin
- `POST /api/cars/upload` — admin image upload

## Project structure

```
cc/
  server/          Express API + SQLite
  public/          Frontend (HTML/CSS/JS)
  data/            SQLite database (created on first run)
  uploads/         Uploaded images
  index.html       Original PRD document
```

## Development

```bash
npm run dev
```

Uses Node `--watch` to restart the server on file changes.

## WhatsApp note

Inquiries use the standard `https://wa.me/{number}?text=...` link. The visitor taps **Send inquiry via WhatsApp**, then sends the pre-filled message in the WhatsApp app. For fully automated server-side messaging you would integrate the WhatsApp Business API later.
