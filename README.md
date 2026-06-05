# Reference form

A small full-stack TypeScript app for collecting a tenancy reference: personal
details, employment history, and a guarantor.

- **client/** — React 18 + Vite + Tailwind CSS, form handling with
  react-hook-form and [Effect Schema](https://effect.website) validation.
- **server/** — Express API with Effect Schema request validation.

## Requirements

Node.js >= 18 (a `.nvmrc` pins Node 20 in each package).

## Getting started

```bash
# API server (http://localhost:4000)
cd server
npm install
npm run dev

# Web client (http://localhost:5173)
cd client
npm install
npm run dev
```

By default the client posts to `https://ref-api.goodlord.co`. To target the
local server instead, create `client/.env` with:

```
VITE_API_URL=http://localhost:4000
```

## API

`POST /reference/new`

```json
{
  "personal": {
    "first_name": "First name",
    "last_name": "Last name",
    "current_address": "Address 1, Address 2, ..."
  },
  "employer": [
    { "name": "Employer", "start_date": "20180301", "end_date": "20190815" }
  ],
  "guarantor": {
    "name": "Guarantor",
    "address": "Address1, Address2, ...",
    "relation": "Parent"
  }
}
```

## Scripts

Each package supports:

- `npm run dev` — start in watch mode
- `npm run build` — type-check and build
- `npm run typecheck` — type-check only
