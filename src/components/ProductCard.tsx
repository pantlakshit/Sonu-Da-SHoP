'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { formatINR } from '@/lib/utils';
import { useToast } from './Toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { showToast } = useToast();
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage?.image_url || '/placeholder-tile.jpg';

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `${product.name} (Ref: ${product.reference_code})`,
      text: `Check out ${product.name} [Ref: ${product.reference_code}] at Berinag Tiles Digital Showroom.`,
      url: `${window.location.origin}/tiles/${product.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      showToast(`Link for ${product.name} copied to clipboard!`);
    }
  };

  return (
    <article className="flex flex-col gap-4 group">
      {/* IMAGE CONTAINER */}
      <Link
        href={`/tiles/${product.slug}`}
        className="w-full aspect-[4/5] bg-surface-container-high relative overflow-hidden border border-outline-variant rounded-lg block cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={primaryImage?.alt_text || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />

        {/* AVAILABILITY BADGE */}
        {product.availability === 'low_stock' && (
          <div className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] font-label-caps px-2.5 py-1 rounded shadow">
            LIMITED STOCK
          </div>
        )}
        {product.availability === 'unavailable' && (
          <div className="absolute top-3 left-3 bg-neutral-800/90 text-white text-[10px] font-label-caps px-2.5 py-1 rounded shadow">
            SHOWROOM DISPLAY ONLY
          </div>
        )}

        {/* QUICK SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 p-2 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
          title="Share design"
          aria-label="Share design"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </Link>

      {/* METADATA */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Link href={`/tiles/${product.slug}`}>
            <h2 className="font-headline text-headline-md text-primary group-hover:underline transition-all">
              {product.name}
            </h2>
          </Link>
          <span className="font-headline text-headline-md text-primary shrink-0 ml-2">
            {formatINR(product.price)} <span className="text-sm font-normal text-secondary">/ {product.price_unit}</span>
          </span>
        </div>

        {/* REFERENCE CODE */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
          <span className="font-body text-body-md text-secondary font-medium tracking-wider">
            {product.reference_code}
          </span>
          {product.brand && (
            <span className="text-xs text-on-surface-variant">
              {product.brand}
            </span>
          )}
        </div>

        {/* SPECIFICATIONS SNIPPET */}
        <ul className="flex flex-wrap gap-2 text-sm text-on-surface-variant pt-1">
          {product.size && <li>{product.size}</li>}
          {product.size && product.finish && <li>•</li>}
          {product.finish && <li>{product.finish} Finish</li>}
        </ul>

        {/* ACTION BUTTON */}
        <Link
          href={`/tiles/${product.slug}`}
          className="mt-4 px-6 py-3 w-full border border-outline text-primary font-label-caps text-label-caps hover:bg-surface-variant hover:border-primary transition-colors uppercase tracking-widest text-center rounded block"
        >
          View Design
        </Link>
      </div>
    </article>
  );
}
