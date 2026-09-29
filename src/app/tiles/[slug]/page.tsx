import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Phone,
  MessageSquare,
  MapPin,
  Share2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Repository } from '@/lib/data/repository';
import { ProductGallery } from '@/components/ProductGallery';
import { ReferenceCodeCopy } from '@/components/ReferenceCodeCopy';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ProductCard } from '@/components/ProductCard';
import { formatINR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await Repository.getProductBySlug(params.slug);
  if (!product) return { title: 'Design Not Found — Berinag Tiles' };

  return {
    title: `${product.name} (Ref: ${product.reference_code}) — Berinag Tiles Showroom`,
    description: `Explore ${product.name} [Ref: ${product.reference_code}] priced at ₹${product.price}/${product.price_unit}. Inspect physical samples at our Berinag showroom.`,
    openGraph: {
      title: `${product.name} | Berinag Tiles`,
      description: product.description || undefined,
      images: product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await Repository.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const [settings, relatedProducts] = await Promise.all([
    Repository.getShopSettings(),
    Repository.getRelatedProducts(product, 4),
  ]);

  return (
    <div className="w-full pb-24 md:pb-16">
      {/* BREADCRUMB */}
      <div className="border-b border-outline-variant bg-surface-container-low/50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3.5 flex items-center gap-2 text-xs font-label-caps text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tiles" className="hover:text-primary transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 md:pt-12">
        {/* TOP SECTION: 2-COLUMN PDP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: DOMINANT IMAGE GALLERY (7 cols on lg) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* RIGHT: SPECIFICATIONS & SHOWROOM ACTIONS (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header & Price */}
            <div className="space-y-3 border-b border-outline-variant pb-6">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
                  {product.category?.name || product.look || 'ARCHITECTURAL TILE'}
                </span>
                {product.brand && (
                  <span className="text-xs font-label-caps text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded">
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl text-primary tracking-tight font-normal">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-headline text-3xl font-medium text-primary">
                  {formatINR(product.price)}
                </span>
                <span className="font-body text-body-md text-secondary">
                  / {product.price_unit}
                </span>
                <span className="text-xs text-on-surface-variant ml-2">
                  (Showroom Retail Rate)
                </span>
              </div>

              {/* Stock Status Badge */}
              <div className="pt-2">
                {product.availability === 'available' && (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-label-caps">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Stock & Ready for Inspection at Berinag Showroom</span>
                  </div>
                )}
                {product.availability === 'low_stock' && (
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-label-caps">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    <span>Limited Stock Available — Confirm Before Visiting</span>
                  </div>
                )}
                {product.availability === 'unavailable' && (
                  <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 border border-neutral-300 px-3 py-1.5 rounded-full text-xs font-label-caps">
                    <Layers className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Display Sample Only — Available on Pre-Order</span>
                  </div>
                )}
              </div>
            </div>

            {/* REFERENCE CODE 1-CLICK COPY */}
            <ReferenceCodeCopy code={product.reference_code} />

            {/* SHOWROOM DIRECT ENQUIRY ACTIONS */}
            <div className="space-y-3 pt-2">
              <WhatsAppButton
                phone={settings.whatsapp}
                productName={product.name}
                referenceCode={product.reference_code}
                price={product.price}
                priceUnit={product.price_unit}
              >
                WHATSAPP SHOWROOM ENQUIRY
              </WhatsAppButton>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-surface-container-high hover:bg-surface-variant border border-outline-variant rounded-xl font-label-caps text-xs text-on-surface tracking-wider uppercase transition-colors text-center"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Call Showroom</span>
                </a>

                <Link
                  href={settings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-surface-container-high hover:bg-surface-variant border border-outline-variant rounded-xl font-label-caps text-xs text-on-surface tracking-wider uppercase transition-colors text-center"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Get Directions</span>
                </Link>
              </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS GRID */}
            <div className="space-y-3 pt-4">
              <h2 className="font-label-caps text-xs text-secondary tracking-widest uppercase">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-2 gap-px bg-outline-variant border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Dimensions
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.size || 'Standard Size'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Thickness
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.thickness || '9.0 mm'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Finish / Texture
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.finish || 'Polished'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Material Type
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.material || 'Glazed Vitrified'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Color Family
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.color || 'Natural'}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-4">
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
                    Recommended Space
                  </span>
                  <span className="block font-body text-sm font-medium text-primary">
                    {product.space || 'Living, Bath'}
                  </span>
                </div>
              </div>
            </div>

            {/* ARCHITECTURAL DESCRIPTION */}
            {product.description && (
              <div className="space-y-2 pt-4">
                <h2 className="font-label-caps text-xs text-secondary tracking-widest uppercase">
                  Architectural Notes & Application
                </h2>
                <p className="font-body text-body-md text-on-surface leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED DESIGNS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="pt-20 mt-20 border-t border-outline-variant">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
                  EXPLORE COMPLEMENTARY MATERIALS
                </span>
                <h2 className="font-headline text-2xl md:text-3xl text-primary tracking-tight mt-1">
                  Related Designs
                </h2>
              </div>
              <Link
                href="/tiles"
                className="text-xs font-label-caps text-primary hover:underline uppercase tracking-wider"
              >
                View Full Catalogue
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Touch-first for smartphones) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant px-4 py-3 pb-safe shadow-lg flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-[10px] font-label-caps text-secondary uppercase">
            REF: {product.reference_code}
          </div>
          <div className="text-sm font-headline font-bold text-primary truncate">
            {formatINR(product.price)} <span className="text-xs font-normal">/{product.price_unit}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="p-3 bg-surface-container-high rounded-xl text-primary border border-outline-variant"
            title="Call Showroom"
          >
            <Phone className="w-4 h-4" />
          </a>

          <WhatsAppButton
            phone={settings.whatsapp}
            productName={product.name}
            referenceCode={product.reference_code}
            price={product.price}
            priceUnit={product.price_unit}
            className="flex items-center gap-2 py-3 px-5 bg-emerald-700 text-white rounded-xl font-label-caps text-xs tracking-wider uppercase shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ENQUIRE</span>
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
