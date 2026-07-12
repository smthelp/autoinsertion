# AGENTS.md - Southern Machinery Auto Insertion Website

## Scope

This file applies to the entire repository. It supplements the organization-level Southern Machinery instructions with rules specific to this Cloudflare Workers project. If instructions conflict, follow the more specific instruction unless it would weaken security, customer privacy, or product-data accuracy.

## Project Purpose

This repository powers Southern Machinery's public B2B product website and its internal administration interface.

- Public site: company presentation, product discovery, product detail pages, and inquiry capture.
- Admin site: product, inquiry, image, and website-setting management.
- Primary audience: overseas EMS, SMT, THT, LED, industrial-control, automotive-electronics, and PCB assembly factories.
- Public-facing copy defaults to English. Developer documentation and internal analysis may use Chinese.
- Brand position: "Automation Partner, Not Supplier."
- Canonical company facts and product specifications come from the organization instructions and the approved 2023 product catalog. Repository placeholder copy is not authoritative.

Do not invent machine specifications, customer counts, certifications, prices, delivery dates, labor savings, ROI periods, or service commitments. When a requested specification is not in an approved source, state that it requires confirmation through `jasonwu@smthelp.com`.

## Current Stack

- Runtime: Cloudflare Workers, ES modules.
- Frontend: server-generated HTML, CSS, and vanilla JavaScript embedded in page modules.
- Database: Cloudflare D1, exposed as `env.DB`.
- Product images: Cloudflare R2, exposed as `env.IMAGES`.
- Website settings: Cloudflare KV, exposed as `env.STATIC_ASSETS`.
- Worker entry point: `src/index.js`.
- Local/deployment CLI: Wrangler 4.
- There is currently no automated test, lint, formatting, or build script.
- This directory may not be a Git working tree. Do not assume Git commands are available.

## Repository Map

```text
.
|- src/index.js                  # Worker fetch entry point
|- src/pages/router.js           # Public/admin page routing
|- src/pages/layout.js           # Shared HTML, CSS, and browser helpers
|- src/pages/*.js                # Server-rendered page modules
|- src/api/router.js             # /api request routing and CORS
|- src/api/handlers/*.js         # D1, R2, KV, and authentication handlers
|- src/utils/auth.js             # Password/token helpers
|- schema/schema.sql             # D1 schema plus development seed data
|- wrangler.toml                 # Worker bindings and environment config
|- README.md                     # English setup/operation guide
|- readme-cn.md                  # Chinese setup/operation guide
|- package.json                  # Wrangler scripts and dependency metadata
```

Keep changes within the owning module. Add a new public page in `src/pages/` and register it in `src/pages/router.js`; add an API domain in `src/api/handlers/` and register it in `src/api/router.js`. Shared page behavior belongs in `src/pages/layout.js`; shared authentication behavior belongs in `src/utils/auth.js` or the admin authentication boundary.

## Commands

```bash
npm install
npm run dev
npm run deploy
```

- Local site: `http://localhost:8787`
- Admin login: `http://localhost:8787/admin`
- Do not run `npm run deploy`, remote D1 commands, R2 mutations, KV mutations, or secret updates without explicit user authorization.
- Prefer local Wrangler resources for development and verification. Never point exploratory work at production data.
- If dependencies change, keep `package.json` and `package-lock.json` synchronized.

## Implementation Conventions

### JavaScript and routing

- Preserve the existing ES-module style and extensionless relative imports used by Wrangler.
- Use `async`/`await` for Worker bindings and request handling.
- Parse request URLs with `new URL(request.url)` and return explicit HTTP status codes.
- API responses must be JSON with `Content-Type: application/json`; pages must use `text/html;charset=UTF-8`.
- Use D1 prepared statements with `.bind(...)`. Never interpolate request data into SQL.
- Validate all request data server-side, even when the browser already validates it.
- Keep public and privileged routes visibly distinct. The presence of an `Authorization` header is not proof of authentication; verify the token and role.
- Avoid returning raw exception messages to public clients in production. Log diagnostic context without customer data and return a stable generic error.

### Frontend

- Follow the existing server-rendered HTML approach unless the user explicitly approves a framework migration.
- Reuse layout tokens and shared helpers before adding page-local styles or scripts.
- Keep the interface responsive across mobile, tablet, and desktop widths.
- Use semantic HTML, associated form labels, keyboard-accessible controls, visible focus states, useful alt text, and sufficient contrast.
- Escape or safely render every database/KV/user-controlled value inserted into HTML. Do not use untrusted content with `innerHTML`.
- Public calls to action should lead to a concrete next step, normally an inquiry, quote request, consultation, sample test, or direct contact.
- Do not ship placeholder company details, dead `#` social links, generic sample products, or unverified claims.

### Content and SEO

- Public copy should be concise, professional English aimed at international B2B buyers.
- Use the company name `Southern Machinery Co., Ltd.` and website `www.smthelp.com` consistently.
- Canonical sales contact: `jasonwu@smthelp.com`; WhatsApp: `+8613602562576`.
- Keep one descriptive `h1` per page, meaningful page titles/descriptions, crawlable product text, and stable product URLs.
- Use solution-selling language: identify the factory problem, show verified data, explain the line-level solution, then provide a CTA.
- ROI claims must expose assumptions and calculation steps. Prices and delivery dates require human confirmation.
- Any customer example must be anonymized unless explicit publication permission is documented.

## Data Contracts

- `products.specifications` is plain text; preserve line breaks when rendering safely.
- `products.gallery_images` is stored as a JSON array string. Parse defensively and treat invalid JSON as an empty list.
- Product booleans are D1 integer values (`0`/`1`). Normalize API input explicitly.
- Inquiry status values are `pending`, `processing`, and `completed`. Schema and UI changes must remain synchronized.
- When changing tables or fields, update `schema/schema.sql`, all affected handlers, admin UI, public UI, and both README files where setup or behavior changes.
- Schema changes must be additive/migratable for existing D1 databases. Do not assume recreating the database is acceptable.

## Security and Privacy Requirements

The current code contains development-era security gaps. Do not copy or extend those patterns. Any work touching authentication, admin APIs, inquiry data, uploads, settings, CORS, or deployment must preserve or improve these requirements:

- Read the JWT secret from a Cloudflare secret/environment binding. Never hard-code it or commit real secrets.
- Use standards-compliant signed tokens and timing-safe verification. Do not treat a custom hash concatenation as production JWT security.
- Passwords require a password-specific salted hash. Plain SHA-256 is not acceptable for production credentials.
- Verify authentication on every admin read and write endpoint, including dashboard statistics and inquiry listing/status updates.
- Enforce role checks on the server. UI visibility is not authorization.
- Restrict CORS to approved origins for privileged or personal-data endpoints; do not default production APIs to `*`.
- Add abuse controls to public inquiry and login endpoints when modifying them: payload limits, rate limiting, and bot mitigation as appropriate.
- Validate upload MIME type, extension, size, object key, and authorization. Do not trust browser-provided metadata alone.
- Inquiry records contain personal data. Do not print names, emails, phone numbers, messages, tokens, or full request bodies to logs or fixtures.
- Do not expose inactive products based only on the shape of an auth header.
- Use generic login failures and avoid account enumeration.

`schema/schema.sql` currently includes default credentials and sample products. Treat them as local development seed data only. Before any production initialization, remove/replace default accounts, sample rows, example email addresses, and placeholder password hashes through an approved secure provisioning flow.

## Cloudflare Configuration

- Binding names are part of the application contract: `DB`, `IMAGES`, and `STATIC_ASSETS`.
- Store secrets with Wrangler/Cloudflare secret management, not in `wrangler.toml`.
- Treat database IDs, KV IDs, bucket names, domains, and environment configuration as deployment-specific. Do not replace them speculatively.
- Separate local, preview, and production configuration when adding environments.
- Do not delete or overwrite R2 objects merely because a product record changes unless lifecycle behavior is explicitly requested and verified.

## Verification Checklist

Match verification effort to the change. At minimum:

1. Start the local Worker with `npm run dev` and confirm it starts without import or binding errors.
2. Exercise affected public pages and APIs, including success, validation failure, unauthorized, forbidden, not-found, and server-error paths where relevant.
3. For frontend changes, inspect desktop and mobile layouts and verify navigation, forms, loading states, error states, and keyboard use.
4. For auth changes, verify missing, malformed, expired, valid-admin, and valid-super-admin tokens.
5. For D1 changes, test against a disposable local database and confirm existing data remains usable.
6. For content changes, cross-check every numeric product/ROI claim against an approved source and report that source in the handoff.
7. Confirm that no secret, token, credential, customer record, or production data was added to files or command output.

Because the repository has no test suite yet, do not claim tests passed unless tests were actually added and run. Report manual checks and any unverified areas explicitly.

## Documentation and Change Discipline

- Keep edits narrowly scoped; do not combine feature work with unrelated redesigns or rewrites.
- Preserve user changes already present in the workspace.
- Update both `README.md` and `readme-cn.md` when commands, bindings, routes, roles, setup, or operator workflows change.
- Comments should explain non-obvious constraints, not narrate simple code.
- Do not add generated assets, local Wrangler state, credentials, customer exports, or production database dumps to the project.
- Before handoff, summarize files changed, behavior changed, verification performed, remaining risks, and any action requiring human review.

## Human Review Gates

Human approval is required before:

- Publishing or deploying changes.
- Sending customer-facing content or using customer data externally.
- Quoting a price or delivery date.
- Publishing a specific performance, ROI, certification, customer, or warranty claim not directly backed by an approved source.
- Mutating production D1, R2, KV, domains, secrets, or admin accounts.
- Making a breaking API/schema change or deleting customer/product data.
