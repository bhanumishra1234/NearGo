# NearGo — Hyper-Local Community Travel Companion & Real-Time City Guide

A community-first, hyper-local city discovery and fair transit platform designed with a clean **White & Clay** theme inspired by modern discussion hubs like Reddit and Quora.

---

## 📌 Overview
Arriving in a new city should be exciting, not confusing or stressful. Most travelers encounter three major pain points:
1. **Fragmented platforms:** Jumping between multiple apps to find where locals actually eat, shop, and hang out.
2. **Fake & sponsored listings:** Commercial review platforms boosting tourist traps instead of authentic neighbourhood favorites.
3. **Price gouging & unfair transit fares:** First-time visitors and students having no benchmark for legal auto-rickshaw meter rates or taxi costs, making them easy targets for unfair pricing.

**NearGo** solves this by acting like having a trusted local friend in every city:
- **Ask real questions:** From *"What is the fair auto fare to Chandni Chowk?"* to *"Where can I find safe midnight street food?"*.
- **Get map-pinned advice:** Verified residents answer with exact GeoJSON coordinates and secret spots attached.
- **Check fair prices live:** Grounded municipal tariff calculations, multi-modal price benchmarking (Auto vs Cab vs Metro vs Bike Taxi), and an interactive **Driver Scam & Price Gouge Auditor**.
- **Street-smart survival phrases:** Indic street slang negotiation guides (e.g., *"Meter se chalo bhaiya"*) with audio phonetics.

---

## 🎨 Design & Theme (White & Clay Community Layout)

The UI has been redesigned to follow a clean, accessible **White & Clay** light theme inspired by Reddit and Quora:
- **Color Palette:**
  - Background: Soft warm clay off-white (`#F7F6F3`)
  - Cards & Navigation: Pure crisp white (`#FFFFFF`) with subtle warm stone borders (`#E8E5DF`)
  - Primary Accent: Terracotta clay orange (`#D9532F`)
  - Secondary Accents: Emerald green (`#15803D`) for verified municipal rates and local credentials, warm clay stone (`#B09172`)
- **3-Column Community Structure:**
  - **Left Sidebar:** City Spaces & Topics (`c/DelhiTransit`, `c/StreetFood`, `c/SecretSpots`, `c/BargainBazaars`, `c/StudentBudget`) and official transport gazette notices.
  - **Center Feed:** Quora-style "What do you want to ask or share?" composer, discussion cards, embedded Live Fair Fare Protection benchmarks, local answers, and Reddit-style interaction pills (`[ ↑ Upvote ↓ ]`, `[ 💬 Answers ]`, `[ 📍 Map Pin ]`).
  - **Right Sidebar:** Live Spatial Mini-Map widget, Quick Auto Fare & Scam Auditor tool, Slang of the Day, and Community Guide.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Role & Function |
| :--- | :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Lucide Icons | Responsive 3-column UI, clean light/clay styling, reactive state |
| **Interactive Mapping** | Leaflet, CartoDB Voyager & OpenStreetMap | Custom map pins (Questions, Local Gems, Transit hubs), popups, and route jump |
| **Backend API** | Node.js, Express.js, CORS | REST endpoints for questions, answers, and fare audits |
| **Fair Price Engine** | Algorithmic Tariff Grounding | Municipal transport rate models, Haversine road detour matrices, multi-modal cost baselines |
| **Build & Tooling** | Vite 5 | Instant HMR development and production bundling |

---

## 📦 How to Run the Project

### Option A: Run Fullstack (Frontend + Backend on Port 5001)
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\neargo
npm run server
```
Then open your browser at:  
👉 **`http://localhost:5001`**  
*(Serves both the REST API and the production-built React frontend!)*

---

### Option B: Run in Development Mode with Hot-Reloading
In terminal 1 (Start Backend Server):
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\neargo
npm run server
```
In terminal 2 (Start Vite Dev Server):
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\neargo
npm run dev
```
Then open:  
👉 **`http://localhost:3000`** *(proxies `/api` to port 5001)*

---

## 🧪 Key Features to Try

1. **Community Discussions:** Explore questions like *"What is the fair auto fare from Okhla / South Delhi to Chandni Chowk right now?"*.
2. **Live Fair Check Card:** Look at the benchmark showing the legal auto meter fare (`₹218 - ₹245`), cab estimates, and Delhi Metro route (`₹40`).
3. **Driver Price Gouge & Scam Auditor:** Open the Fair Fare tool, enter a driver quote like ₹500, and see the real-time audit flagging the +113% hike with local negotiation phrases.
4. **Interactive Spatial Map:** Toggle between "Discussions" and "Map Pins" to explore exact pins across South Delhi, Old Delhi, Moolchand, and Majnu Ka Tilla.
5. **Indic Negotiation Slang:** Click "Indic Street Slang" to listen to native pronunciations of street survival phrases like *"Meter se chalo bhaiya"*.
