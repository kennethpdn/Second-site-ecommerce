# Security Specification - Éclat Express Firestore Rules

## 1. Data Invariants & Zero-Trust Principles
- **No Client Writes Anywhere:** All creations and mutations (`commandes`, `demandesPro`, `newsletter`, stock decrement, product updates) happen exclusively on the server runtime via Firebase Admin SDK with server-side validation.
- **Client Read-Only Whitelist:**
  - `categories`: Public read.
  - `produits`: Public read ONLY where `actif == true`.
  - `packs`: Public read ONLY where `actif == true`.
  - `avis`: Public read ONLY where `valide == true`.
  - `config`: Public read for `config/site`.
- **Sensitive Collections Denied to Client:**
  - `commandes`: Contains customer PII (phone, address, order details). Client cannot read or write directly.
  - `demandesPro`: Contains B2B customer contact info. Client cannot read or write directly.
  - `newsletter`: Contains customer emails. Client cannot read or write directly.
- **Default Deny:** Catch-all `match /{document=**} { allow read, write: if false; }`.

## 2. The "Dirty Dozen" Malicious Payloads Tested
1. Direct client `create` on `/commandes` with forged total of 0 FCFA -> DENIED.
2. Client `update` on `/produits/{id}` attempting to set `prix: 1` -> DENIED.
3. Client `update` on `/produits/{id}` attempting to increment `stock: 9999` -> DENIED.
4. Client `delete` on any document in `/produits` -> DENIED.
5. Client `read` on `/commandes` list to scrape phone numbers and addresses -> DENIED.
6. Client `read` on `/commandes/{id}` single document -> DENIED.
7. Client `read` on `/produits` where `actif == false` (hidden/draft products) -> DENIED.
8. Client `read` on `/packs` where `actif == false` -> DENIED.
9. Client `read` on `/avis` where `valide == false` (spam or unverified reviews) -> DENIED.
10. Client `write` to `/newsletter` to spam emails or scrape lists -> DENIED.
11. Client `write` to `/config/site` to tamper with delivery threshold or WhatsApp number -> DENIED.
12. Client injection of shadow field or oversized payload on any endpoint -> DENIED.
