import React from 'react';
import { Repository } from '@/lib/data/repository';
import { CategoriesClient } from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await Repository.getCategories();
  return <CategoriesClient initialCategories={categories} />;
}
