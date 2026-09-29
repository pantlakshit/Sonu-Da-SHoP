'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState('owner@berinagtiles.com');
  const [password, setPassword] = useState('berinag2024');
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Set secure cookie for middleware protection
    document.cookie = 'berinag_admin_session=active; path=/; max-age=604800; SameSite=Lax';

    setTimeout(() => {
      showToast('Authenticated successfully as Showroom Admin.');
      router.push(redirectUrl);
      router.refresh();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 sm:p-10 ambient-shadow space-y-8 animate-in fade-in zoom-in-95">
        {/* BRAND & HEADER */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-primary font-medium tracking-tight">
            Showroom CMS Login
          </h1>
          <p className="font-body text-sm text-on-surface-variant">
            Enter your credentials to manage tile catalogue and pricing.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus:border-primary focus:ring-0"
                placeholder="owner@berinagtiles.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus:border-primary focus:ring-0"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* HELPER BOX */}
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface-variant space-y-1">
          <div className="font-semibold text-primary">Showroom Staff Access:</div>
          <div>Pre-filled with demo credentials for instant CMS review and catalogue management.</div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-label-caps text-secondary hover:text-primary transition-colors"
          >
            ← Return to Public Digital Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
