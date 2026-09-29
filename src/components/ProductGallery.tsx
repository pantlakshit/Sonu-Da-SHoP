'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/types/database';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = images.length > 0 ? images : [
    {
      id: 'default',
      product_id: '',
      storage_path: null,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8GfVJJZJmZ9ZSSrVYM3rnPOvMs9FxiHJGEYhjRh6ZmoAEqYEIZBnt95fca9ub-4Xd4tD7D0UJbjF9yuTBeMsX09gRqsPvlgSIzcl22aWrXbi9hvJJa1v9jb47Jv6h1jpuP4VLmDZOJAGl3EgXrT9G99f1O1vVbZZf1xUcd7z8yYcaUHLcN6QNuIpqJ6RX3hztvOgSQl9ZzFQSUNuABldyafnPO2lKr5kfeuj4SLbOI_ee3c8M-3jG',
      alt_text: productName,
      sort_order: 1,
      is_primary: true,
      created_at: '',
    },
  ];

  const currentImage = validImages[selectedIndex] || validImages[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* MAIN VIEW */}
      <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
          onClick={() => setLightboxOpen(true)}
        />

        {/* FULLSCREEN BUTTON */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2 bg-surface/80 backdrop-blur-md rounded-full text-primary hover:bg-surface transition-colors shadow-sm"
          title="Open fullscreen view"
          aria-label="Open fullscreen view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* MOBILE SWIPE INDICATORS / CONTROLS */}
        {validImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-2 bg-surface/80 hover:bg-surface backdrop-blur-md rounded-full text-primary pointer-events-auto transition-colors shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-2 bg-surface/80 hover:bg-surface backdrop-blur-md rounded-full text-primary pointer-events-auto transition-colors shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PAGINATION PILL */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[11px] font-label-caps px-3 py-1 rounded-full">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* THUMBNAIL STRIP */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-primary shadow-sm scale-105'
                  : 'border-outline-variant opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.alt_text || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="flex justify-between items-center text-white">
            <span className="font-headline text-lg">{productName}</span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-white/70 text-xs font-label-caps">
            Image {selectedIndex + 1} of {validImages.length} • Click anywhere to close
          </div>
        </div>
      )}
    </div>
  );
}
