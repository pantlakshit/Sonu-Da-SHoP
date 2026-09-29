import React from 'react';
import { Repository } from '@/lib/data/repository';
import { ProductsClient } from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    Repository.getProducts(),
    Repository.getCategories(),
  ]);

  return <ProductsClient initialProducts={products} categories={categories} />;
}
