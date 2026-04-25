# NusaERP Marketing Website
Landing page for NusaERP Odoo 19 installation services, built with Vite (vanilla JS/CSS).

## Tech Stack
- Vite (vanilla JS/CSS)
- No framework dependencies
- OpenRouter AI Chat Widget (integrated with NusaERP API)

## Prerequisites
- Node.js installed
- NusaERP API Server running (http://localhost:3000)

## Setup
1. Install dependencies:
   ```bash
   cd /home/dindin/odoo19-marketing
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
   Access at http://localhost:5174

## Features
- Mobile-responsive design
- Odoo 19 feature showcase
- Pricing package (Rp 1.5M promo)
- Lead capture form (sends to API server)
- AI Customer Service chat widget (Agent 6 CS via OpenRouter)
- Scroll animations (Intersection Observer)
- WhatsApp contact integration (+628****2778)

## Integration Notes
- Lead form submits to `http://localhost:3000/api/leads`
- Chat widget sends messages to `http://localhost:3000/api/chat`
- All AI responses are in Indonesian via OpenRouter
- Connected to Mission Control Dashboard via API server

## Key Files
- `index.html`: Main HTML structure
- `style.css`: All styling (responsive, animations)
- `main.js`: Interactivity (form submit, chat widget, scroll animations)
- `public/favicon.svg`: NusaERP favicon

## Important Notes for AI Agents
1. Branding: Always use "NusaERP" (not OdooReady)
2. Tagline: "NusaERP — Odoo 19 Solusi ERP Terjangkau dari Indonesia"
3. Pricing: Rp 1.750.000 → Promo Rp 1.500.000 (Hemat Rp 250.000)
4. Never include "Community" when referencing Odoo 19
5. Odoo 19 features: Accounting, Sales, Inventory, Manufacturing, Purchasing, POS
6. Hosting: VPS Gratis Selamanya (never mention specific providers like DigitalOcean)
7. Contact: WhatsApp +628****2778 (Dindin - Tim Marketing), no email support
8. Chat widget must always use OpenRouter `tencent/hy3-preview:free` model
