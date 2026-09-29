import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
          404 — PAGE NOT FOUND
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl text-primary font-normal">
          Design or Page Not Located
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          The tile design or catalogue page you requested may have been relocated or updated in our showroom catalogue.
        </p>
      </div>
      <div className="pt-4 flex gap-4">
        <Link
          href="/tiles"
          className="px-6 py-3.5 bg-primary text-on-primary rounded font-label-caps text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow"
        >
          EXPLORE CATALOGUE
        </Link>
        <Link
          href="/"
          className="px-6 py-3.5 border border-outline text-primary rounded font-label-caps text-xs tracking-widest uppercase hover:bg-surface-variant transition-colors"
        >
          HOMEPAGE
        </Link>
      </div>
    </div>
  );
}
