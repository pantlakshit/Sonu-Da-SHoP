import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, Clock, ExternalLink, Navigation } from 'lucide-react';
import { Repository } from '@/lib/data/repository';

export const metadata: Metadata = {
  title: 'Visit Showroom & Contact — Berinag Tiles',
  description: 'Visit the Berinag Tiles physical showroom in Main Market, Berinag, Uttarakhand. Phone, WhatsApp, and Google Maps directions.',
};

export default async function ContactPage() {
  const settings = await Repository.getShopSettings();

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 space-y-16">
      {/* HEADER */}
      <section className="max-w-3xl space-y-4">
        <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
          SHOWROOM LOCATION & ENQUIRIES
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-primary tracking-tight font-normal">
          Visit Us in Berinag
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant">
          We invite you to physically see and feel our collection of tiles, marbles, and stone finishes.
        </p>
      </section>

      {/* 2-COLUMN CONTACT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* LEFT: DETAILS & ACTIONS (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Card 1: Address */}
          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="w-6 h-6 shrink-0" />
              <h2 className="font-headline text-xl font-medium">Showroom Address</h2>
            </div>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
              {settings.address}
            </p>
            <a
              href={settings.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-label-caps text-xs tracking-wider uppercase hover:underline pt-2"
            >
              <span>OPEN IN GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Hours */}
          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Clock className="w-6 h-6 shrink-0" />
              <h2 className="font-headline text-xl font-medium">Operating Hours</h2>
            </div>
            <p className="font-body text-body-md text-on-surface-variant">
              {settings.opening_hours}
            </p>
            <span className="inline-block text-xs font-label-caps text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Open 7 Days a Week
            </span>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow"
            >
              <Phone className="w-5 h-5 text-white" />
              <span>Call: {settings.phone}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Berinag%20Tiles%2C%20I%20would%20like%20to%20visit%20your%20showroom.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-emerald-700 text-white rounded-xl font-label-caps text-label-caps tracking-widest uppercase hover:bg-emerald-800 transition-colors shadow"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span>WhatsApp Showroom</span>
            </a>
          </div>
        </div>

        {/* RIGHT: MAP / SHOWROOM PREVIEW (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative aspect-square sm:aspect-[16/10] bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant shadow-md">
            {/* Showroom Map Graphic & Landmark Overlay */}
            <div className="absolute inset-0 bg-surface-container-low flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow-lg animate-bounce">
                <Navigation className="w-8 h-8" />
              </div>
              <h3 className="font-headline text-2xl text-primary font-medium mb-2">
                Berinag Showroom Landmark
              </h3>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mb-6">
                Centrally located on Main Market Road, adjacent to State Bank of India, Berinag. Ample customer parking available outside the showroom.
              </p>
              <a
                href={settings.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-caps text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow"
              >
                Launch Navigation & Directions
              </a>
            </div>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-body text-secondary">
            <strong>Visiting Tip:</strong> If you are planning a large renovation or building project, note the reference codes of your preferred designs from our catalogue before visiting for an expedited sample review.
          </div>
        </div>
      </div>
    </main>
  );
}
