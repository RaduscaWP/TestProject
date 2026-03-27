# CLAUDE.md — AI Assistant Guide for TestProject

This file provides context for AI assistants (Claude, Copilot, etc.) working on this repository.

---

## Project Overview

**TestProject** is a single-page web application (SPA) that combines a marketing landing page for a coding bootcamp ("CodeAcademy") with an order management system. It is built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

- **Open to use:** Open `index.html` in a browser directly (no server required).
- **Author:** Radu-Ștefan Grozav

---

## Repository Structure

```
/
├── index.html              # Main HTML entry point (landing page + app shell)
├── script.js               # All application logic (~660 lines)
├── style.css               # All styles, dark theme, animations (~633 lines)
├── package.json            # npm config; defines test scripts and Jest config
├── package-lock.json       # Locked dependency versions
├── README.md               # Brief project overview
├── __tests__/              # Jest test suites
│   ├── state.test.js       # Tests for state management functions
│   ├── dom.test.js         # Tests for DOM rendering and page routing
│   ├── validation.test.js  # Tests for input validation functions
│   └── localStorage.test.js# Tests for localStorage persistence (CRUD)
└── *.svg                   # SVG assets used in the landing page
```

---

## Architecture

### Single-File Application (`script.js`)

All application logic lives in `script.js`. There is no module bundler. The file is split into logical sections:

1. **State Objects** — Plain JS objects holding form field values:
   ```js
   let client = { nume, prenume, telefon }
   let produs = { nume, cantitate }
   let livrare = { adresa, data }
   let editId = -1  // -1 = new order; >=0 = editing existing order at that index
   ```

2. **Validation Functions** — Pure functions returning `boolean`:
   - `okClient()` — name ≥5 chars, surname ≥5 chars, phone exactly 8 digits
   - `okProdus()` — product name ≥7 chars, quantity >0
   - `okLivrare()` — address ≥5 chars, date not empty
   - `setState(input, ok)` — applies `.valid` or `.error` CSS class to an input

3. **State Functions**:
   - `makeOrder()` — assembles the current state into an order object
   - `clearData()` — resets all state fields and `editId` to defaults
   - `updateShowBtn()` — shows/hides the "place order" button based on validation

4. **Page Router** — `showPage(page)` switches between views:
   | Page key  | Description                        |
   |-----------|------------------------------------|
   | `client`  | Customer info form                 |
   | `produse` | Product form                       |
   | `livrare` | Delivery details form              |
   | `comanda` | Order summary (requires full validation) |
   | `lista`   | All saved orders (CRUD table)      |

5. **DOM Renderers** — `showClient()`, `showProdus()`, `showLivrare()`, `showComanda()`, `showLista()` each build and inject HTML into `.exam-zone`.

6. **Persistence** — Uses `localStorage` with key `listaComenzi` (JSON array of orders). Supports create, read, update, delete.

7. **Module Exports** (CommonJS) — Functions and state are exported at the bottom for Jest testing:
   ```js
   module.exports = { client, produs, livrare, okClient, okProdus, ... }
   ```

### HTML (`index.html`)

- Loads `script.js` with `defer` and `style.css`.
- Contains the static marketing landing page (hero, courses, features, review, email signup, footer).
- Inline `onclick` handlers: `login()`, `signUp()`, `verificare()`, `registerMe()` — these are defined in `script.js`.
- The app mounts into a `<section class="exam-app">` that is created and injected dynamically by `script.js`.

### CSS (`style.css`)

- Dark mode design; CSS custom properties defined on `:root`.
- Key color variables: `--bg-dark: #0d0f1a`, `--accent-blue: #4f6ef7`, `--accent-purple: #7b5cf0`, `--success: #22c55e`, `--error: #ef4444`.
- Layout uses Flexbox; responsive breakpoints at `800px` and `1100px`.
- Animations: `fadeUp` entrance keyframes, hover `translateY(-3px)` with box-shadow glow, button shine via `::after`.

---

## Naming Conventions

### JavaScript
- **camelCase** for all function and variable names.
- State object properties use **Romanian** field names: `prenume` (surname), `adresa` (address), `livrare` (delivery), `comanda` (order), `comenzi` (orders list).
- Boolean-returning validators are prefixed `ok`: `okClient`, `okProdus`, `okLivrare`.

### CSS Classes
- App container classes use `.exam-*` prefix: `.exam-app`, `.exam-box`, `.exam-zone`, `.exam-form`, `.exam-table`.
- Button classes: `.btn-*` for landing page buttons; form buttons use descriptive classes: `.save-client`, `.save-produs`, `.save-livrare`, `.final-btn`, `.open-btn`, `.del-btn`.
- Validation state classes: `.valid` (green), `.error` (red).

---

## Development Workflow

### Running the App
No build step needed. Open `index.html` directly in any modern browser.

### Running Tests
```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

**Test environment:** Jest with `jest-environment-jsdom` (simulates a browser DOM).

### Test Setup Pattern
Each test file follows this pattern:
```js
beforeEach(() => {
    document.body.innerHTML = '<div class="hero"></div>'
    localStorage.clear()
    jest.resetModules()
    app = require('../script')
})
```
This resets the DOM, clears localStorage, and re-requires `script.js` fresh for each test to avoid state leakage between tests.

---

## Testing Conventions

- **4 test suites, 96 tests** covering ~87% of `script.js`.
- Boundary value testing is standard: e.g., 4-char name (invalid) vs. 5-char name (valid).
- DOM tests assert on injected `innerHTML` content, not component props.
- Tests import the app via `require('../script')` (CommonJS), not ES module imports.
- Mocking: `localStorage` is mocked via jsdom's built-in implementation; no manual mocks.
- Coverage is collected from `script.js` only (configured in `package.json`).

When adding new functions to `script.js`, export them at the bottom of the file and add corresponding tests in the appropriate `__tests__/` file.

---

## Key Patterns to Follow

### Adding a New Page/View
1. Add a case to the `showPage(page)` switch in `script.js`.
2. Create a `showMyPage()` renderer function that injects HTML into `.exam-zone`.
3. Add navigation trigger (button click) in the appropriate renderer.
4. Export the new function at the bottom for testability.
5. Write DOM tests in `__tests__/dom.test.js`.

### Adding a New Validation Rule
1. Write the validator as a pure function returning `boolean`.
2. Call `setState(inputElement, result)` to apply visual feedback.
3. Export the validator and write boundary tests in `__tests__/validation.test.js`.

### Modifying State
- Always reset state via `clearData()` after a save or cancel action.
- Use `editId` to distinguish new-order vs. edit-order modes; never use a different mechanism.
- State changes must be reflected in `makeOrder()` output — update that function if new fields are added.

### localStorage / Persistence
- All orders are stored under the single key `"listaComenzi"` as a JSON array.
- Read: `JSON.parse(localStorage.getItem('listaComenzi') || '[]')`
- Write: `localStorage.setItem('listaComenzi', JSON.stringify(array))`
- Do not introduce additional localStorage keys without updating related tests.

---

## What to Avoid

- **Do not introduce a build system** (webpack, Vite, etc.) without explicit instruction — the project intentionally runs without one.
- **Do not add framework dependencies** (React, Vue, etc.) — this is a vanilla JS project.
- **Do not use ES module syntax** (`import`/`export`) in `script.js` — Jest is configured for CommonJS (`require`/`module.exports`), and the file is loaded with a `<script>` tag.
- **Do not rename Romanian field names** (`prenume`, `adresa`, etc.) — they are part of the established data model and tests depend on them.
- **Do not add a backend** unless explicitly requested — all persistence is client-side via localStorage.

---

## Branch & Git Workflow

- **Feature development branch:** `claude/add-claude-documentation-CFoBu`
- **Main branch:** `main`
- Push feature work to the designated feature branch; do not push directly to `main`.
- There is no CI/CD pipeline; tests must be run manually with `npm test`.

---

## Dependency Summary

| Package                  | Version   | Purpose                         |
|--------------------------|-----------|---------------------------------|
| jest                     | ^29.7.0   | Test runner                     |
| jest-environment-jsdom   | ^29.7.0   | Browser DOM simulation for Jest |

No runtime dependencies. No TypeScript. No linter. No formatter.
