import React from 'react';
import { notFound } from 'next/navigation';
import { Repository } from '@/lib/data/repository';
import { EditProductClient } from './EditProductClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    Repository.getProductById(params.id),
    Repository.getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductClient initialProduct={product} categories={categories} />;
}
