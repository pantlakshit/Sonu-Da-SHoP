'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Category, FilterState, Product } from '@/types/database';
import { ProductCard } from '@/components/ProductCard';
import { CatalogueFilters } from '@/components/CatalogueFilters';

interface CatalogueClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function CatalogueClient({
  initialProducts,
  categories,
}: CatalogueClientProps) {
  const searchParams = useSearchParams();

  const initialLook = searchParams.get('look') ? [searchParams.get('look')!] : undefined;
  const initialCategory = searchParams.get('category') || undefined;
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    look: initialLook,
    sortBy: 'newest',
  });

  const [searchInput, setSearchInput] = useState(initialSearch);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (filters.category) {
      const targetCat = categories.find((c) => c.slug === filters.category || c.id === filters.category);
      if (targetCat) {
        list = list.filter((p) => p.category_id === targetCat.id);
      }
    }

    // Look filter
    if (filters.look && filters.look.length > 0) {
      list = list.filter((p) => p.look && filters.look?.includes(p.look));
    }

    // Finish filter
    if (filters.finish && filters.finish.length > 0) {
      list = list.filter((p) => p.finish && filters.finish?.includes(p.finish));
    }

    // Search query across name, ref code, brand, color, look, finish, size, space
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.reference_code.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          (p.look && p.look.toLowerCase().includes(q)) ||
          (p.finish && p.finish.toLowerCase().includes(q)) ||
          (p.size && p.size.toLowerCase().includes(q)) ||
          (p.space && p.space.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return list;
  }, [initialProducts, categories, filters]);

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-12 md:py-16 max-w-container-max mx-auto flex flex-col gap-12">
      {/* HEADER & SEARCH */}
      <section className="flex flex-col gap-6 w-full max-w-4xl">
        <div>
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
            LIVE CATALOGUE ({filteredProducts.length} DESIGNS)
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-headline-display text-primary tracking-tight mt-1">
            Explore Our Tile Collection
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mt-2">
            Discover designs, colours and finishes before you visit our showroom in Berinag.
          </p>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setFilters((prev) => ({ ...prev, search: e.target.value }));
            }}
            placeholder="Search tiles, styles, colours or reference code (e.g. WP-482)..."
            className="w-full bg-surface-container-lowest border-b-2 border-outline focus:border-primary pl-12 pr-12 py-4 text-body-lg font-body text-primary placeholder:text-on-surface-variant outline-none transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setFilters((prev) => ({ ...prev, search: '' }));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </section>

      {/* SORTING & SUMMARY BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div className="text-sm font-body text-secondary">
          Showing <strong className="text-primary">{filteredProducts.length}</strong> available designs
          {filters.search && (
            <span> for &quot;<span className="text-primary">{filters.search}</span>&quot;</span>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-label-caps text-on-surface-variant uppercase">Sort By:</span>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="text-xs font-label-caps uppercase bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-primary focus:ring-0 focus:border-primary"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* MAIN LAYOUT: FILTERS + GRID */}
      <div className="flex flex-col md:flex-row gap-gutter items-start">
        {/* Filters Sidebar */}
        <CatalogueFilters
          categories={categories}
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-surface-container-low rounded-2xl border border-outline-variant p-8 space-y-4">
              <h3 className="font-headline text-2xl text-primary font-medium">No designs found</h3>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mx-auto">
                We couldn&apos;t find any tiles matching your current search or filter combination.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-label-caps">
                <button
                  onClick={() => {
                    setSearchInput('');
                    setFilters({ sortBy: 'newest' });
                  }}
                  className="px-6 py-3 bg-primary text-on-primary rounded uppercase tracking-wider hover:bg-neutral-800"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
