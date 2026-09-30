import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, ShieldCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { Repository } from '@/lib/data/repository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Our Showroom — Karki Tiles',
  description: 'Learn about Karki Tiles, our physical material showroom, and our commitment to bringing world-class architectural tiles to Uttarakhand.',
};

export default async function AboutPage() {
  const settings = await Repository.getShopSettings();

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 space-y-16">
      {/* HERO INTRO */}
      <section className="max-w-3xl space-y-6">
        <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
          ABOUT OUR SHOWROOM
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-primary tracking-tight font-normal">
          Architectural Material Standards in the Hills of Berinag.
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
          Karki Tiles was founded to solve a simple problem: homeowners, architects, and builders in Kumaon should have direct access to India&apos;s finest vitrified slabs, Italian marble reproductions, and heavy-duty stone surfaces without traveling to distant metropolitan centres.
        </p>
      </section>

      {/* SHOWROOM EXPERIENCE HERO IMAGE */}
      <section className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-outline-variant shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2gbf1XGyyziojK0lIUe-0R8sYLQJxJOD9XBwwjqyCDRIJQv5XNmG0l3mfPZw2F79XfytuPe0P6hh6M5WbJll9Z8yc4GwZSYEVAvXyNADfcJjYl2BBDIionywoX8LFCgnMcF0KgDr4sVNEPJCgNJfYRIREN4FRjwkO_n84W-nl9BgOA6CxfCva6MNAAlOnnblIxHdbW2wFZgUawgsP0qHW1VRc3FCH9j22kHzf4X2HV1CG_IRctFfY"
          alt="Berinag Showroom Floor"
          className="w-full h-full object-cover"
        />
      </section>

      {/* CORE PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-headline text-xl text-primary font-medium">Physical Tactile Gallery</h3>
          <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
            A tile is not just a digital photo; it is texture, cold stone touch, reflectivity, and weight. Our Berinag showroom features full-scale mockups so you can touch the material before deciding.
          </p>
        </div>

        <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-headline text-xl text-primary font-medium">Mountain Weather Durability</h3>
          <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
            We specialize in frost-resistant vitrified slabs, R11 anti-skid terrace tiles, and heavy-traffic parking stone engineered specifically for Himalayan climates and monsoon rains.
          </p>
        </div>

        <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-headline text-xl text-primary font-medium">Transparent Digital Catalogue</h3>
          <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
            Our online Digital Showroom reflects current stock, authentic dimensions, and live pricing. Browse online, copy the reference code, and walk in with certainty.
          </p>
        </div>
      </section>

      {/* LOCAL TRUST & VISIT CTA */}
      <section className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <h2 className="font-headline text-2xl md:text-3xl text-primary">
            Plan your visit to our Berinag showroom
          </h2>
          <p className="font-body text-on-surface-variant text-body-md">
            Our staff will guide you through dimensions, mortar compatibility, and lighting layout.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/contact"
            className="px-8 py-4 bg-primary text-on-primary rounded font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow"
          >
            GET DIRECTIONS
          </Link>
        </div>
      </section>
    </main>
  );
}
