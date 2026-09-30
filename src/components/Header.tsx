'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hide public header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tiles?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tiles', label: 'Catalogue' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Visit' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-outline-variant transition-all">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          {/* LOGO */}
          <Link
            href="/"
            className="font-headline text-headline-md tracking-tighter text-primary flex items-center gap-2 group"
          >
            <span className="font-bold">KARKI TILES</span>
            <span className="text-[10px] font-label-caps tracking-widest text-secondary border border-outline-variant px-1.5 py-0.5 rounded hidden sm:inline-block">
              SHOWROOM
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 font-body text-body-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/tiles' && pathname.startsWith('/tiles'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? 'text-primary font-semibold border-b-2 border-primary pb-0.5'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-primary hover:text-secondary transition-colors"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="https://wa.me/919000000000?text=Hello%20Karki%20Tiles%2C%20I%20would%20like%20to%20enquire%20about%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-label-caps text-secondary hover:text-primary border border-outline-variant px-3 py-1.5 rounded-full transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WHATSAPP</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary hover:text-secondary transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* SEARCH BAR DRAWER */}
        {searchOpen && (
          <div className="border-t border-outline-variant bg-surface-container-lowest px-margin-mobile md:px-margin-desktop py-4 shadow-md animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tiles, styles, colours or reference code (e.g. WP-482)..."
                className="w-full bg-transparent border-none text-body-lg text-primary placeholder:text-on-surface-variant focus:ring-0 outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary rounded font-label-caps text-xs tracking-wider uppercase hover:bg-neutral-800"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-on-surface-variant hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col pt-20 px-6 pb-8 md:hidden animate-in fade-in">
          <div className="flex justify-between items-center absolute top-4 left-6 right-6">
            <span className="font-headline text-headline-md tracking-tighter">KARKI TILES</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-xl font-headline mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-surface-variant pb-4 text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-8 border-t border-outline-variant">
            <div className="flex items-center gap-2 text-sm text-secondary">
              <MapPin className="w-4 h-4" />
              <span>Main Market, Berinag, Uttarakhand</span>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-4 bg-primary text-on-primary text-center rounded-lg font-label-caps text-label-caps tracking-widest uppercase"
            >
              VISIT SHOWROOM
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
