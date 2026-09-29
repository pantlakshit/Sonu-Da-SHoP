'use client';

import React, { useState } from 'react';
import { Category, FilterState } from '@/types/database';
import { Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface CatalogueFiltersProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

const LOOK_OPTIONS = ['Marble', 'Wood', 'Stone', 'Concrete', '3D', 'Terracotta'];
const FINISH_OPTIONS = ['Glossy', 'Matte', 'Satin', 'Honed', 'Polished'];

export function CatalogueFilters({
  categories,
  filters,
  onFilterChange,
}: CatalogueFiltersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleCategorySelect = (categorySlug?: string) => {
    onFilterChange({
      ...filters,
      category: categorySlug === filters.category ? undefined : categorySlug,
    });
  };

  const handleLookToggle = (look: string) => {
    const current = filters.look || [];
    const updated = current.includes(look)
      ? current.filter((l) => l !== look)
      : [...current, look];
    onFilterChange({
      ...filters,
      look: updated.length > 0 ? updated : undefined,
    });
  };

  const handleFinishToggle = (finish: string) => {
    const current = filters.finish || [];
    const updated = current.includes(finish)
      ? current.filter((f) => f !== finish)
      : [...current, finish];
    onFilterChange({
      ...filters,
      finish: updated.length > 0 ? updated : undefined,
    });
  };

  const handleClear = () => {
    onFilterChange({
      search: filters.search,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    Boolean(filters.category) ||
    (filters.look && filters.look.length > 0) ||
    (filters.finish && filters.finish.length > 0) ||
    Boolean(filters.availability);

  return (
    <>
      {/* MOBILE TRIGGER */}
      <div className="flex md:hidden items-center justify-between gap-4 w-full bg-surface-container-low p-3 rounded-lg border border-outline-variant mb-6">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-xs font-label-caps text-primary uppercase"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters & Categories {hasActiveFilters && '• Active'}</span>
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-secondary hover:text-primary flex items-center gap-1 font-label-caps"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* DESKTOP SIDEBAR FILTERS */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-8">
        {/* RESET BUTTON IF ACTIVE */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase">
              Active Filters
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-secondary hover:text-primary flex items-center gap-1 font-label-caps"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* CATEGORY FILTER */}
        <div className="flex flex-col gap-4">
          <h3 className="font-label-caps text-label-caps text-secondary uppercase border-b border-outline-variant pb-2">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect(undefined)}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                !filters.category
                  ? 'bg-primary text-on-primary font-medium'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                  filters.category === cat.slug
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOOK FILTER */}
        <div className="flex flex-col gap-3">
          <h3 className="font-label-caps text-label-caps text-secondary uppercase border-b border-outline-variant pb-2">
            Look / Material
          </h3>
          <ul className="flex flex-col gap-2.5">
            {LOOK_OPTIONS.map((look) => {
              const checked = filters.look?.includes(look) || false;
              return (
                <li key={look}>
                  <label className="flex items-center gap-3 cursor-pointer group text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleLookToggle(look)}
                      className="rounded border-outline-variant text-primary focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        checked ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-primary'
                      }`}
                    >
                      {look}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {/* FINISH FILTER */}
        <div className="flex flex-col gap-3">
          <h3 className="font-label-caps text-label-caps text-secondary uppercase border-b border-outline-variant pb-2">
            Surface Finish
          </h3>
          <ul className="flex flex-col gap-2.5">
            {FINISH_OPTIONS.map((finish) => {
              const checked = filters.finish?.includes(finish) || false;
              return (
                <li key={finish}>
                  <label className="flex items-center gap-3 cursor-pointer group text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleFinishToggle(finish)}
                      className="rounded border-outline-variant text-primary focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        checked ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-primary'
                      }`}
                    >
                      {finish}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-background h-full p-6 flex flex-col gap-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="font-headline text-lg text-primary font-medium">Catalogue Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <span className="font-label-caps text-xs text-secondary uppercase">Category</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect(undefined)}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    !filters.category ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      filters.category === cat.slug ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Look */}
            <div className="space-y-3">
              <span className="font-label-caps text-xs text-secondary uppercase">Look</span>
              <div className="flex flex-wrap gap-2">
                {LOOK_OPTIONS.map((look) => {
                  const checked = filters.look?.includes(look);
                  return (
                    <button
                      key={look}
                      onClick={() => handleLookToggle(look)}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        checked ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      {look}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish */}
            <div className="space-y-3">
              <span className="font-label-caps text-xs text-secondary uppercase">Finish</span>
              <div className="flex flex-wrap gap-2">
                {FINISH_OPTIONS.map((finish) => {
                  const checked = filters.finish?.includes(finish);
                  return (
                    <button
                      key={finish}
                      onClick={() => handleFinishToggle(finish)}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        checked ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      {finish}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant flex gap-3">
              <button
                onClick={handleClear}
                className="flex-1 py-3 border border-outline-variant rounded font-label-caps text-xs uppercase"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-primary text-on-primary rounded font-label-caps text-xs uppercase"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
