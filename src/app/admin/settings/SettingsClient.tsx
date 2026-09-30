'use client';

import React, { useState } from 'react';
import { Save, Store, Phone, MessageSquare, MapPin, Clock, Globe, Image as ImageIcon } from 'lucide-react';
import { ShopSettings } from '@/types/database';
import { useToast } from '@/components/Toast';
import { updateSettingsAction } from '../actions';

interface SettingsClientProps {
  initialSettings: ShopSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ShopSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await updateSettingsAction(settings);
      setSettings(updated);
      showToast('Showroom settings updated successfully! Public website reflects new details.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-margin-desktop max-w-container-max mx-auto space-y-8 pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg text-primary tracking-tight font-normal">
            Showroom Settings
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Manage your business information, WhatsApp contact, address, and showroom hours.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* SECTION 1: BUSINESS IDENTITY */}
        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant ambient-shadow space-y-6">
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant pb-4">
            <Store className="w-5 h-5" />
            <h2 className="font-headline text-xl font-medium">Business Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                Showroom Name *
              </label>
              <input
                type="text"
                required
                value={settings.shop_name}
                onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                Showroom Description
              </label>
              <textarea
                rows={3}
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: DIRECT ENQUIRY & CONTACT */}
        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant ambient-shadow space-y-6">
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant pb-4">
            <Phone className="w-5 h-5" />
            <h2 className="font-headline text-xl font-medium">Customer Enquiry Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Phone Number (Calls) *
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0 font-mono"
              />
              <span className="text-[11px] text-secondary">Used for 1-click telephone calling</span>
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Number (Showroom Enquiries) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0 font-mono"
              />
              <span className="text-[11px] text-secondary">
                Powers pre-formatted WhatsApp product enquiries
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: PHYSICAL LOCATION & HOURS */}
        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant ambient-shadow space-y-6">
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant pb-4">
            <MapPin className="w-5 h-5" />
            <h2 className="font-headline text-xl font-medium">Showroom Location & Hours</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                Physical Showroom Address *
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Google Maps URL / Directions Link *
                </label>
                <input
                  type="url"
                  required
                  value={settings.maps_url}
                  onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Operating Hours *
                </label>
                <input
                  type="text"
                  required
                  value={settings.opening_hours}
                  onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOMEPAGE VISUAL HERO */}
        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant ambient-shadow space-y-6">
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant pb-4">
            <ImageIcon className="w-5 h-5" />
            <h2 className="font-headline text-xl font-medium">Homepage Hero Visual</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                Hero Image URL (Architectural Showroom Backdrop)
              </label>
              <input
                type="url"
                value={settings.hero_image_url || ''}
                onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                placeholder="https://..."
                className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
              />
            </div>

            {settings.hero_image_url && (
              <div className="relative aspect-[21/9] rounded-lg overflow-hidden border border-outline-variant max-w-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.hero_image_url}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-caps text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Settings...' : 'Save Showroom Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
