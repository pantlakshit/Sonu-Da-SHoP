import React from 'react';
import { Repository } from '@/lib/data/repository';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await Repository.getShopSettings();
  return <SettingsClient initialSettings={settings} />;
}
