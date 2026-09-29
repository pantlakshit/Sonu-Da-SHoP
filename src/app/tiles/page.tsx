import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Repository } from '@/lib/data/repository';
import { CatalogueClient } from './CatalogueClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Complete Tile Catalogue — Berinag Digital Showroom',
  description: 'Explore our complete architectural collection of vitrified tiles, marble slabs, wooden planks, and outdoor stone paving.',
};

export default async function TilesCataloguePage() {
  const [products, categories] = await Promise.all([
    Repository.getPublishedProducts(),
    Repository.getActiveCategories(),
  ]);

  return (
    <Suspense fallback={<div className="p-20 text-center text-secondary">Loading catalogue...</div>}>
      <CatalogueClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
