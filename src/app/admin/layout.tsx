'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logOutAction } from '@/app/admin/actions';
import {
  LayoutDashboard,
  Grid,
  FolderTree,
  Settings,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render without admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: Grid,
      active: pathname.startsWith('/admin/products'),
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: FolderTree,
      active: pathname.startsWith('/admin/categories'),
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface antialiased">
      {/* DESKTOP SIDEBAR (Stitch Layout) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant py-8 px-4 flex flex-col z-40 hidden md:flex">
        {/* Header / Profile */}
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            BT
          </div>
          <div className="overflow-hidden">
            <h2 className="font-headline text-lg font-bold text-primary truncate">Showroom CMS</h2>
            <p className="font-body text-xs text-on-surface-variant truncate">Karki Branch</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-2 flex-grow font-label-caps text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-lg transition-all ${
                    item.active
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-outline-variant flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full border border-outline text-primary px-4 py-3 rounded-lg font-label-caps text-xs uppercase hover:bg-surface-container-high transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={async () => {
              await logOutAction();
              router.push('/admin/login');
              router.refresh();
            }}
            className="flex items-center justify-center gap-2 w-full text-secondary hover:text-error text-xs font-label-caps py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface-container-low border-b border-outline-variant px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="font-headline font-bold text-sm">KARKI CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-xs font-label-caps text-secondary border border-outline-variant rounded"
          >
            View Site
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-primary"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-20 px-6 pb-8 md:hidden flex flex-col gap-6 animate-in fade-in">
          <div className="flex justify-between items-center absolute top-4 left-6 right-6">
            <span className="font-headline font-bold text-lg">Showroom Admin</span>
            <button onClick={() => setMobileNavOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 font-label-caps text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-lg ${
                    item.active
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-outline-variant space-y-3">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileNavOpen(false)}
              className="block w-full py-3.5 bg-primary text-on-primary text-center rounded-lg font-label-caps text-xs tracking-widest uppercase"
            >
              Open Digital Showroom
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 ml-0 md:ml-64 w-full min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
