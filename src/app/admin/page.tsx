import React from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowRight,
  Edit2,
  Layers,
  CheckCircle2,
  Star,
  FolderTree,
  Store,
  Info,
  DollarSign,
  Tag,
  Camera,
} from 'lucide-react';
import { Repository } from '@/lib/data/repository';
import { formatINR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [products, categories, settings] = await Promise.all([
    Repository.getProducts(),
    Repository.getCategories(),
    Repository.getShopSettings(),
  ]);

  const inStockCount = products.filter((p) => p.availability === 'available').length;
  const featuredCount = products.filter((p) => p.featured).length;
  const activeCategoriesCount = categories.filter((c) => c.active).length;

  const recentProducts = products.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="w-full px-4 sm:px-8 md:px-margin-desktop py-8 md:py-12 border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg text-primary tracking-tight font-normal">
              Good day, Karki Team
            </h1>
            <p className="font-body text-body-md text-on-surface-variant mt-1">
              Live showroom inventory & digital catalogue management.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="bg-primary text-on-primary px-6 py-3.5 rounded-lg font-label-caps text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow"
            >
              <Camera className="w-4 h-4" />
              <span>Add New Tile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 p-4 sm:p-8 md:p-margin-desktop max-w-container-max w-full mx-auto space-y-10">
        {/* SUMMARY METRICS (BENTO GRID) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-gutter">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl ambient-shadow flex flex-col justify-between h-36 sm:h-40">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                Total Designs
              </span>
              <Layers className="w-5 h-5 text-secondary" />
            </div>
            <div className="font-headline text-3xl sm:text-4xl text-primary font-normal">
              {products.length}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl ambient-shadow flex flex-col justify-between h-36 sm:h-40">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                In Stock
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-headline text-3xl sm:text-4xl text-primary font-normal">
              {inStockCount}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl ambient-shadow flex flex-col justify-between h-36 sm:h-40">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                Featured
              </span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-headline text-3xl sm:text-4xl text-primary font-normal">
              {featuredCount}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl ambient-shadow flex flex-col justify-between h-36 sm:h-40">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                Categories
              </span>
              <FolderTree className="w-5 h-5 text-secondary" />
            </div>
            <div className="font-headline text-3xl sm:text-4xl text-primary font-normal">
              {activeCategoriesCount}
            </div>
          </div>
        </section>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: RECENT UPDATES (2 cols) */}
          <section className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-headline text-xl text-primary font-medium">Recent Updates</h3>
                <Link
                  href="/admin/products"
                  className="font-label-caps text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-outline-variant">
                {recentProducts.map((product) => {
                  const imgUrl =
                    product.images?.find((i) => i.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    '/placeholder.jpg';

                  return (
                    <div
                      key={product.id}
                      className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-container-high rounded-lg border border-outline-variant overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-headline text-base sm:text-lg text-primary font-medium">
                            {product.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-label-caps text-[11px] text-secondary">
                              REF: {product.reference_code}
                            </span>
                            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                            <span className="font-body text-xs font-semibold text-primary">
                              {formatINR(product.price)} /{product.price_unit}
                            </span>
                            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                            {product.availability === 'available' ? (
                              <span className="text-[11px] text-emerald-700 font-medium font-label-caps">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-medium font-label-caps">
                                Limited / Pre-order
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-variant transition-colors shrink-0"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant bg-surface-container-low/50 text-center">
              <Link
                href="/admin/products"
                className="text-xs font-label-caps text-secondary hover:text-primary uppercase tracking-wider"
              >
                Manage All {products.length} Products →
              </Link>
            </div>
          </section>

          {/* RIGHT: QUICK ACTIONS & STATUS (1 col) */}
          <aside className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow p-6 space-y-4">
              <h3 className="font-headline text-xl text-primary font-medium mb-4">Quick Actions</h3>

              <div className="space-y-2.5">
                <Link
                  href="/admin/products/new"
                  className="w-full text-left px-4 py-3.5 border border-outline-variant rounded-lg font-body text-sm text-primary hover:bg-surface-container-low hover:border-primary transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Camera className="w-4 h-4 text-secondary group-hover:text-primary" />
                    Take Photo & Add Tile
                  </span>
                  <Plus className="w-4 h-4 text-secondary group-hover:text-primary" />
                </Link>

                <Link
                  href="/admin/products"
                  className="w-full text-left px-4 py-3.5 border border-outline-variant rounded-lg font-body text-sm text-primary hover:bg-surface-container-low hover:border-primary transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Tag className="w-4 h-4 text-secondary group-hover:text-primary" />
                    Update Prices & Stocks
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary" />
                </Link>

                <Link
                  href="/admin/categories"
                  className="w-full text-left px-4 py-3.5 border border-outline-variant rounded-lg font-body text-sm text-primary hover:bg-surface-container-low hover:border-primary transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <FolderTree className="w-4 h-4 text-secondary group-hover:text-primary" />
                    Manage Categories
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary" />
                </Link>

                <Link
                  href="/admin/settings"
                  className="w-full text-left px-4 py-3.5 border border-outline-variant rounded-lg font-body text-sm text-primary hover:bg-surface-container-low hover:border-primary transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Store className="w-4 h-4 text-secondary group-hover:text-primary" />
                    Showroom Contact & Hours
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary" />
                </Link>
              </div>
            </div>

            {/* STATUS CARD */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 space-y-2">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-headline text-sm text-primary font-medium">
                    Digital Catalogue Live
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    All updates to pricing, stock availability, and imagery are automatically synchronized with customer-facing pages.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
