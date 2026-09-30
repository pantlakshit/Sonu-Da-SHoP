'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  X,
  Camera,
} from 'lucide-react';
import { Category, Product } from '@/types/database';
import { formatINR } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { duplicateProductAction, deleteProductAction } from '../actions';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference_code.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    return list;
  }, [products, selectedCategory, selectedStatus, search]);

  const handleDuplicate = async (product: Product) => {
    setIsProcessing(true);
    try {
      const duplicate = await duplicateProductAction(product.id);
      setProducts([duplicate, ...products]);
      showToast(`Duplicated as "${duplicate.name}" (Ref: ${duplicate.reference_code}).`);
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate product', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
      await deleteProductAction(deleteTarget.id);
      setProducts(products.filter((p) => p.id !== deleteTarget.id));
      showToast(`Deleted "${deleteTarget.name}".`);
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-margin-desktop max-w-container-max mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg text-primary tracking-tight font-normal">
            Showroom Products
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Manage catalogue specifications, pricing, imagery, and showroom stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-on-primary px-6 py-3.5 rounded-lg font-label-caps text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow"
        >
          <Camera className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant ambient-shadow">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ref code (e.g. WP-482)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary focus:ring-0"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary focus:ring-0"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary focus:ring-0"
          >
            <option value="all">All Statuses (Draft & Published)</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE (DESKTOP) & CARDS (MOBILE) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low font-label-caps text-xs text-secondary uppercase">
                  <th className="p-4 pl-6">Material</th>
                  <th className="p-4">Reference Code</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body">
                {filteredProducts.map((p) => {
                  const imgUrl =
                    p.images?.find((i) => i.is_primary)?.image_url ||
                    p.images?.[0]?.image_url ||
                    '/placeholder.jpg';
                  const cat = categories.find((c) => c.id === p.category_id);

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-headline font-medium text-primary text-base">
                              {p.name}
                            </div>
                            <div className="text-xs text-on-surface-variant">{p.brand || '—'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Reference Code */}
                      <td className="p-4 font-headline font-bold text-primary tracking-wider">
                        {p.reference_code}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-on-surface-variant">
                        {cat?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-medium text-primary">
                        {formatINR(p.price)} <span className="text-xs font-normal text-secondary">/{p.price_unit}</span>
                      </td>

                      {/* Availability */}
                      <td className="p-4">
                        {p.availability === 'available' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-label-caps">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            In Stock
                          </span>
                        ) : p.availability === 'low_stock' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-label-caps">
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-full font-label-caps">
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full"></span>
                            Showroom Only
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-block text-xs font-label-caps px-2.5 py-1 rounded uppercase ${
                            p.status === 'published'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-secondary'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/tiles/${p.slug}`}
                            target="_blank"
                            className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="View Live Product"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(p)}
                            disabled={isProcessing}
                            className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 text-secondary hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-3">
            <Layers className="w-8 h-8 text-outline mx-auto" />
            <div className="font-headline text-lg text-primary">No products matching filter</div>
            <p className="text-sm text-on-surface-variant">
              Try adjusting your search keywords or category filters.
            </p>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION SAFETY MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 ambient-shadow space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-error">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-headline text-xl font-medium">Confirm Delete</h3>
            </div>

            <p className="font-body text-body-md text-on-surface-variant">
              Are you sure you want to permanently remove <strong>&quot;{deleteTarget.name}&quot;</strong> (Ref: {deleteTarget.reference_code}) from the catalogue?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 border border-outline-variant rounded-lg font-label-caps text-xs uppercase hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-error text-on-error rounded-lg font-label-caps text-xs uppercase hover:bg-red-700 transition-colors shadow"
              >
                {isProcessing ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
