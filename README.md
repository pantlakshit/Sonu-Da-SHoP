# 🏛️ Karki Tiles — Digital Showroom OS

> **Premium Architectural Material Catalogue + Owner CMS for Local Showrooms**  
> Physical Showroom: **Karki, Uttarakhand, India**

---

## 🌟 Overview

**Digital Showroom OS** is a full-stack digital catalogue and CMS built to eliminate the need for sending individual tile photos manually through WhatsApp.

### Customer Journey:
1. **Discover** curated tile designs, marble slabs, wooden planks, and outdoor pavers online.
2. **Filter & Search** by Look (Marble, Wood, Stone, 3D), Finish (Glossy, Matte, Honed), Space (Living Room, Bathroom, Outdoor), and Reference Code.
3. **1-Click Reference Code Copy** (e.g. `WP-482`).
4. **1-Click WhatsApp Enquiry** with auto-filled design specifications.
5. **Visit Showroom** in Karki to physically touch and inspect the material.

### Owner CMS (Mobile-First):
- **Direct Smartphone Camera Capture**: Tap `Take Photo` inside the showroom, capture new tile shipments, preview/retake, and publish.
- **Dynamic Pricing & Stock**: Change prices, mark items in-stock or limited stock, and update shop contact details without touching code.
- **Single Source of Truth**: Powered by Netlify Database (PostgreSQL) and Netlify Blobs.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Netlify Database (PostgreSQL)
- **Storage**: Netlify Blobs
- **Auth**: Custom JWT
- **Deployment Target**: Netlify

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm ci
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Public Showroom: `http://localhost:3000`
   - Catalogue: `http://localhost:3000/tiles`
   - Owner CMS: `http://localhost:3000/admin`
   - Add Tile (Camera UI): `http://localhost:3000/admin/products/new`

---

## 🌐 Deploy to Netlify

1. Push this repository to **GitHub**.
2. Connect your repo on [Netlify](https://netlify.com).
3. Netlify automatically detects the **Next.js** framework preset.
4. Add the following **Environment Variables** in Netlify:
   - `SESSION_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
5. Enable **Netlify Database** and **Netlify Blobs** for the site.
6. The schema migration is in `netlify/database/migrations/0000_schema.sql`.
7. Click **Deploy**!
