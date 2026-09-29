import React from 'react';
import { redirect } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export default function CategoryRedirectPage({ params }: Props) {
  redirect(`/tiles?category=${encodeURIComponent(params.slug)}`);
}
