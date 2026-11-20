# Project Objective
Build a modern, responsive, bilingual (English & Khasi) Frontend Web Application dedicated to Khasi clan genealogy (*Tipkur Tipkha*). The app must feature an organic, physics-driven interactive network graph and a multi-step traditional relationship compatibility checker.

# Tech Stack & Architecture
- **Framework:** React (Vite) with TypeScript for strict type safety around API responses and graph nodes.
- **Styling:** Tailwind CSS with CSS variables for seamless Light/Dark mode and custom theme switching.
- **Graph & Physics Engine:** D3.js (`d3-force`) rendered via HTML5 Canvas (for high performance with touch/pinch gestures) or hybrid SVG/Canvas, ensuring smooth 60fps physics simulations.
- **Icons & Animations:** Lucide-React for UI icons; Framer Motion for smooth screen transitions, modals, and card animations.
- **State & Persistence:** React Context + `localStorage` for persisting user language preference (EN/KHA), active theme, recent surname searches, and API auth tokens/mock toggles.

---

# Global Features & UI/UX Requirements
1. **Bilingual Engine (English & Khasi):**
   - Implement a clean dictionary-based localization system (`en.json` and `kha.json`) with a persistent top-bar language toggle (`EN | KHA`).
   - All UI labels, onboarding prompts, relationship tier descriptions, and error messages must dynamically switch languages without reloading the page.
2. **Modern Cultural UI & Theming:**
   - Support Light Mode, Dark Mode, and a subtle Khasi-inspired heritage accent palette (e.g., warm woven reds, earthy tones, and crisp slate/off-white backgrounds).
   - Mobile-first design with generous touch targets, bottom-sheet drawers for mobile node details, and clean typography.
3. **API Integration Layer (Modular & Ready for Schema Injection):**
   - Create a dedicated `services/api.ts` service using `fetch` or `axios`.
   - Configure `POST` requests supporting `Authorization: Bearer <TOKEN>` and `Content-Type: application/json`.
   - Include a clean **Mock Data Mode** toggle in a developer/settings drawer so the UI and physics graph can be tested immediately before plugging in the live JSON endpoints and response schemas.

---

# Feature 1: "Wad ki kur jong phi" (Search for Your Clan Links)
An interactive, force-directed Network Graph visualizing Khasi clan relationships up to 3 degrees of separation.

## User Flow & Graph Mechanics
1. **Initial Onboarding:**
   - Display a centered, clean search input asking the user for their surname (*"Buh ia ka jait jong phi"* / *"Enter your surname"*).
   - Include autocomplete/history suggestions from `localStorage`.
2. **Physics & Visual Hierarchy (D3-Force):**
   - **Center Node (Origin):** User's confirmed surname locked or heavily weighted at the center, styled distinctly (larger radius, glowing ring).
   - **Ring 1 — Direct Bloodline (*"Ka juh ka kpoh"*):** Closest surnames (typically 1 to 3 nodes). Tightest spring distance, thick solid connecting lines, distinct badge/color.
   - **Ring 2 — First Linked Clans (*"Ba ia dei kur"*):** Connected to Ring 1 or Origin. Medium spring distance, medium line weight.
   - **Ring 3 — Second Linked Clans (*"Ba ia teh kur"*):** Outer tier. Looser spring distance, dashed or thinner lines.
   - **Ring 4 — Rare Distant Links (*"Ba don jingiadei"*):** Farthest nodes, subtle styling.
   - **Physics Rules:** Implement charge repulsion (`forceManyBody`) so circles naturally push apart without overlapping, link attraction (`forceLink`) calibrated by relationship tier, and collision detection (`forceCollide`).
3. **Touch & Mouse Interactivity:**
   - Full support for **click/tap, drag-and-release nodes** (with physics re-heating), **pan**, and **pinch-to-zoom / scroll-zoom**.
   - **Dynamic Node Focusing:** When a user taps/clicks on *any* outer circle, smoothly animate the camera to center on that node, pull its immediate linked nodes closer, and open a floating card/bottom sheet showing the exact Khasi & English relationship path from the origin surname.
   - Include a legend toggling visibility of specific tiers (*Ka juh ka kpoh*, *Ba ia dei kur*, etc.) and a "Reset View" button.

---

# Feature 2: Traditional Relationship Compatibility Checker
A fun, respectful, step-by-step interactive flow rooted in Khasi *Sang* (taboo/kinship) traditions to check if two people share clan ties.

## Multi-Step Checking Flow
1. **Level 1 Check (Direct Maternal Clan Check):**
   - Input Person 1's surname and Person 2's surname.
   - Send `POST` request to the compatibility endpoint.
   - **Result Display:** Show a clear visual verdict (e.g., *"Related / Sang"* vs. *"No Direct Clan Link Found"*), displaying the exact relationship tier (*Ka juh ka kpoh*, *Ba ia dei kur*, etc.) if a match exists.
2. **Level 2 Check (Paternal / Other Parent's Clan Check):**
   - If Level 1 clears (or if the user wants a deeper check), prompt Person 1: *"Enter your father's / other parent's surname"* (*"Ka jait u kpa"*).
   - Run a secondary check comparing Person 1's paternal surname against Person 2's surname.
   - Display combined Level 1 + Level 2 relationship status clearly.
3. **Level 3 Check (Extensible Architecture):**
   - Build the step-wizard state machine to cleanly support a **Level 3 Check** placeholder (e.g., *"Coming Soon: Extended Lineage Check"*), making it trivial to add a third API call later without refactoring the UI.

---

# Implementation Instructions for Antigravity
1. Scaffold the folder structure cleanly (`src/components/graph`, `src/components/checker`, `src/i18n`, `src/services`, `src/types`).
2. Build a realistic mock JSON dataset using authentic Khasi surnames (e.g., *Syiemlieh, Lyngdoh, Kharkongor, Nongkynrih, Marbaniang, Mawlong, Pyngrope*) demonstrating all 4 relationship tiers (*Ka juh ka kpoh*, *Ba ia dei kur*, *Ba ia teh kur*, *Ba don jingiadei*) so the physics simulation can be visually verified right away.
3. Ensure zero horizontal overflow on mobile viewports and smooth 60fps canvas/SVG rendering.
4. Once the base app is scaffolded, pause and ask me for:
   - The exact `POST` endpoint URLs and Bearer token config.
   - The exact Request/Response JSON schemas for both features so you can map the TypeScript interfaces and API adapters.