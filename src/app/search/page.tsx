import React from 'react';
import { redirect } from 'next/navigation';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; query?: string };
}) {
  const query = searchParams.q || searchParams.query || '';
  redirect(`/tiles?search=${encodeURIComponent(query)}`);
}
