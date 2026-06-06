# AI session log

This document records the AI-assisted work that produced the validation
changes on top of the initial reference-form scaffold. It captures the prompt
history, the actions taken in response, and the reasoning/assumptions behind
each step, so the solution is reproducible and reviewable.

- **Tool:** Claude Code (Anthropic), model Claude Opus 4.8.
- **Scope of changes committed:** CORS local-dev fix, schema validation
  (length, date range, date order), tests, and documentation.
- **Assumptions** are summarised in the project [README](../README.md#assumptions);
  this log adds the conversational context behind them.

## Prompt history and actions

The prompts below are the user's, in order. Each is followed by a summary of
what was done and why. Discussion-only exchanges are included for context but
produced no code changes.

### 1. CORS error running front and back

> I run fron and back and got this error: Access to XMLHttpRequest at
> `https://ref-api.goodlord.co/reference/new` from origin
> `http://localhost:5173` has been blocked by CORS policy …

**Diagnosis:** the client falls back to the hosted API
(`https://ref-api.goodlord.co`) when `VITE_API_URL` is unset
(`client/src/lib/api.ts`). That host does not return an
`Access-Control-Allow-Origin` header for the `localhost:5173` origin, so the
browser blocks the request — the local Express server (which *does* allow that
origin) was never being hit.

**Action:** created `client/.env` with `VITE_API_URL=http://localhost:4000`.
Noted that Vite bakes `import.meta.env` at startup, so the dev server must be
restarted. The file is git-ignored and local-only, so it is **not** part of the
committed solution; the requirement is documented in the README instead.

### 2–5. Discussion only (no code changes)

- **"why do you use vite"** — clarified Vite is the project's existing build
  tool (`"dev": "vite"`), not a choice introduced here.
- **"how hard is it to switch from create-react-app to vite"** — explained the
  migration effort and the common friction points (env var renames, JSX-in-`.js`
  files, test runner).
- **"what is the benefit"** — covered dev-server speed, CRA's deprecation, and
  modern defaults.
- **"can we use SPA / single-spa inspector"** — distinguished a plain SPA (which
  this app already is) from the `single-spa` micro-frontend framework; concluded
  it would be over-engineering here. User confirmed the interest was
  learning-only.
- **"brief explanation of how the front end works with Effect, plus/minus"** —
  walked through the schema → hook → presentational-component layering and the
  trade-offs of Effect Schema vs alternatives like Zod.

### 6. Add length and date-range restrictions

> Lets add more restriction for length, for date format like it cant be earlier
> then 1970 and later 2100

**Action:** applied matching rules to the client form schema
(`client/src/lib/schema.ts`, `YYYY-MM-DD`) and the server payload schema
(`server/src/schema.ts`, `YYYYMMDD`):

- Max length on text fields — names ≤ 100, addresses ≤ 200.
- Date format check plus an inclusive year range of 1970–2100.

Added tests on both sides and verified type-checks pass.

**Assumptions:** the 100/200 limits are sensible defaults (the upstream API
contract was not specified); year bounds treated as inclusive.

### 7. End date must be after start date

> add end cant be later then start

**Interpretation:** read as the natural employment-dates rule — the end date
cannot be *before* the start date (start ≤ end). Flagged that the literal
wording was the opposite and invited correction.

**Action:** added a cross-field `Schema.filter` on the employer struct in both
schemas, targeting the error at the `end_date` path so it renders under the
end-date input. Relied on the fact that both date formats sort lexicographically
in chronological order, so a plain string comparison suffices.

### 8. Equality not allowed either

> it cant be equal as well

**Action:** tightened the comparison from `<=` to `<` (end **strictly after**
start) in both schemas, updated the messages, and flipped the relevant tests.

### 9. Commit and push

> push changes and commit

**Action:** created branch `add-length-and-date-validation` off `main`, committed
the schema and test changes, and pushed with upstream tracking.

### 10. Document assumptions

> make sure to share in the README any other assumptions you have made

**Action:** added "Validation rules" and "Assumptions" sections to the README;
committed and pushed to the same branch.

### 11. Merge to main

> can you merge to main

**Action:** fast-forward merged the branch into `main` and pushed.

### 12. This document

> commit any AI context/documentation along with your prompt history as part of
> the solution

**Action:** added this `docs/ai-session.md` and committed it.

## Files changed by the AI-assisted work

- `client/src/lib/schema.ts`, `client/src/lib/schema.test.ts`
- `server/src/schema.ts`, `server/src/schema.test.ts`
- `README.md`
- `docs/ai-session.md` (this file)
- `client/.env` — created locally for the CORS fix, **git-ignored**, not committed.

## Verification

At each step the relevant suites were run: client (Jest) and server (Jest), plus
`tsc --noEmit` type-checks. Final state: client and server test suites pass and
both packages type-check cleanly.
