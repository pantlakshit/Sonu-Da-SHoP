# 🏛️ Berinag Tiles — Digital Showroom OS

> **Premium Architectural Material Catalogue + Owner CMS for Local Showrooms**  
> Physical Showroom: **Berinag, Uttarakhand, India**

---

## 🌟 Overview

**Digital Showroom OS** is a full-stack digital catalogue and CMS built to eliminate the need for sending individual tile photos manually through WhatsApp.

### Customer Journey:
1. **Discover** curated tile designs, marble slabs, wooden planks, and outdoor pavers online.
2. **Filter & Search** by Look (Marble, Wood, Stone, 3D), Finish (Glossy, Matte, Honed), Space (Living Room, Bathroom, Outdoor), and Reference Code.
3. **1-Click Reference Code Copy** (e.g. `WP-482`).
4. **1-Click WhatsApp Enquiry** with auto-filled design specifications.
5. **Visit Showroom** in Berinag to physically touch and inspect the material.

### Owner CMS (Mobile-First):
- **Direct Smartphone Camera Capture**: Tap `Take Photo` inside the showroom, capture new tile shipments, preview/retake, and publish.
- **Dynamic Pricing & Stock**: Change prices, mark items in-stock or limited stock, and update shop contact details without touching code.
- **Single Source of Truth**: Powered by Supabase PostgreSQL and Supabase Storage with Row Level Security (RLS).

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS (Google Stitch Design System tokens)
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth + Supabase Storage
- **Icons**: Lucide React + Material Symbols
- **Deployment Target**: Vercel

---

## 📦 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Editorial Homepage
│   │   ├── tiles/              # Live Catalogue & Product Details
│   │   ├── about/              # Showroom story & local trust
│   │   ├── contact/            # Showroom location & directions
│   │   ├── admin/              # Owner CMS (Dashboard, Products, Camera, Settings)
│   │   ├── robots.ts           # SEO crawl configuration
│   │   ├── sitemap.ts          # Dynamic XML sitemap
│   │   └── layout.tsx          # Root Layout with typography & ToastProvider
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Mobile Camera & Image Upload manager
│   │   ├── Header.tsx          # Sticky responsive header
│   │   ├── Footer.tsx          # Stitch 3-column footer
│   │   ├── ProductCard.tsx     # Image-first 4:5 product card
│   │   ├── ProductGallery.tsx  # Multi-photo zoom lightbox
│   │   ├── ReferenceCodeCopy.tsx # 1-click clipboard copy
│   │   └── WhatsAppButton.tsx  # WhatsApp pre-filled enquiry generator
│   ├── lib/
│   │   ├── data/repository.ts  # Unified Supabase + Local Data Layer
│   │   ├── image-optimizer.ts  # Client-side mobile camera compression
│   │   └── utils.ts            # INR formatting, slugs, ref code generator
│   ├── types/database.ts       # TypeScript database schema types
│   └── middleware.ts           # Route protection for /admin
├── supabase/
│   ├── schema.sql              # PostgreSQL schema & RLS policies
│   └── seed.sql                # Initial showroom seed data
├── .env.example                # Required environment variables template
├── .gitignore                  # Git ignore rules
└── tailwind.config.ts          # Stitch design system tokens
```

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
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

## 🌐 Deploy to Vercel

1. Push this repository to **GitHub**.
2. Connect your repo on [Vercel](https://vercel.com).
3. Vercel automatically detects the **Next.js** framework preset.
4. Add the following **Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**!
