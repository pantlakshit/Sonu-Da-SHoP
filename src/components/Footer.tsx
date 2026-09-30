'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, MapPin, Clock, ExternalLink } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant mt-20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* COL 1: BRAND */}
        <div className="flex flex-col gap-4">
          <div className="font-headline text-headline-md tracking-tighter text-primary">
            KARKI TILES
          </div>
          <p className="font-body text-body-md text-on-surface-variant max-w-sm">
            Discover curated tile designs, colours and architectural finishes digitally, then visit our showroom in Berinag to inspect and feel the real materials.
          </p>
          <p className="font-body text-sm text-secondary pt-2">
            © {new Date().getFullYear()} Karki Tiles Showroom. All rights reserved.
          </p>
        </div>

        {/* COL 2: VISIT US */}
        <div className="flex flex-col gap-4 font-body text-body-md">
          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
            VISIT OUR SHOWROOM
          </span>
          <div className="flex items-start gap-2.5 text-on-surface-variant">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>Main Market, Near State Bank, Berinag, Pithoragarh, Uttarakhand 262531</span>
          </div>
          <div className="flex items-center gap-2.5 text-on-surface-variant">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>Mon - Sun: 9:00 AM – 7:30 PM</span>
          </div>
          <Link
            href="https://maps.google.com/?q=Berinag+Uttarakhand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-medium pt-1"
          >
            <span>Get Directions on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* COL 3: ENQUIRE & CONNECT */}
        <div className="flex flex-col gap-4 font-body text-body-md">
          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
            ENQUIRY & CONTACT
          </span>
          <div className="flex flex-col gap-3">
            <a
              href="tel:+919412078456"
              className="flex items-center gap-2.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>Call Showroom: +91 94120 78456</span>
            </a>
            <a
              href="https://wa.me/919412078456?text=Hello%20Karki%20Tiles%2C%20I%20am%20interested%20in%20visiting%20your%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>WhatsApp Direct Enquiry</span>
            </a>
            <Link
              href="/tiles"
              className="text-on-surface-variant hover:text-primary transition-colors text-sm underline pt-2"
            >
              Browse Complete Digital Catalogue
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
