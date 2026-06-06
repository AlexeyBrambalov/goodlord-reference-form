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

## Validation rules

The client form schema (`YYYY-MM-DD` dates) and the server payload schema
(`YYYYMMDD` dates) enforce matching rules. Client-side validation drives the
inline error messages; the server repeats the checks as the authoritative
backstop.

- **Required** — all text fields and dates must be non-empty; `relation` must
  be one of `Parent`, `Sibling`, `Employer`, `Other`.
- **Length** — names ≤ 100 characters, addresses ≤ 200 characters.
- **Dates** — must match the expected format and fall within the inclusive
  year range **1970–2100**.
- **Date order** — the employment end date must be **strictly after** the
  start date (equal dates are rejected).

## Assumptions

Decisions made while building the above that weren't fully specified, recorded
here so they can be revisited:

- **Local development targets the bundled server.** The client defaults to the
  hosted API (`https://ref-api.goodlord.co`), which does not allow the
  `localhost:5173` origin via CORS. Running front and back together therefore
  requires `client/.env` with `VITE_API_URL=http://localhost:4000` (see
  [Getting started](#getting-started)). This file is git-ignored and local-only.
- **Field-length limits (100 / 200) are sensible defaults**, not values dictated
  by the upstream API. Adjust the `NAME_MAX_LENGTH` / `ADDRESS_MAX_LENGTH`
  constants in both schemas if the real contract differs.
- **The 1970–2100 year bounds are treated as inclusive.**
- **"End after start" is strict** — an employment period cannot start and end on
  the same day.
- **Date comparison is lexicographic.** Both `YYYY-MM-DD` and `YYYYMMDD` sort
  chronologically as plain strings, so the order check needs no date parsing.
- **Calendar validity is not enforced.** A well-formed but impossible date such
  as `2020-02-31` passes the schema; in practice the `<input type="date">`
  picker only emits real dates, so this is left to the browser.
- **The form captures a single employer**, although the API accepts an array.
  The client wraps the entry in a one-element array when building the payload.

## Scripts

Each package supports:

- `npm run dev` — start in watch mode
- `npm run build` — type-check and build
- `npm run typecheck` — type-check only
