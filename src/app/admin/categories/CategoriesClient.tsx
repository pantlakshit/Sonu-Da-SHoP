'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, FolderTree, X } from 'lucide-react';
import { Category } from '@/types/database';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '../actions';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('1');
  const [loading, setLoading] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setActive(true);
    setSortOrder((categories.length + 1).toString());
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setActive(cat.active);
    setSortOrder(cat.sort_order.toString());
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        const updated = await updateCategoryAction(editingId, {
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim() || null,
          image_url: imageUrl.trim() || null,
          active,
          sort_order: parseInt(sortOrder) || 1,
        });
        setCategories(categories.map((c) => (c.id === editingId ? updated : c)));
        showToast(`Category "${name}" updated.`);
      } else {
        const created = await createCategoryAction({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim() || null,
          image_url: imageUrl.trim() || null,
          active,
          sort_order: parseInt(sortOrder) || categories.length + 1,
        });
        setCategories([...categories, created]);
        showToast(`Category "${name}" created.`);
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to remove category "${catName}"?`)) return;
    try {
      await deleteCategoryAction(id);
      setCategories(categories.filter((c) => c.id !== id));
      showToast(`Category "${catName}" removed.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-margin-desktop max-w-container-max mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg text-primary tracking-tight font-normal">
            Showroom Categories
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Organize materials into floor, wall, marble slabs, and architectural collections.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-primary text-on-primary px-6 py-3.5 rounded-lg font-label-caps text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 ambient-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-headline text-xl text-primary font-medium">{cat.name}</h3>
                <span
                  className={`text-[10px] font-label-caps px-2.5 py-1 rounded uppercase ${
                    cat.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {cat.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs font-mono text-secondary">/{cat.slug}</div>
              {cat.description && (
                <p className="font-body text-xs text-on-surface-variant line-clamp-2">
                  {cat.description}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-outline-variant text-xs">
              <span className="font-label-caps text-secondary">Order: #{cat.sort_order}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-secondary hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 ambient-shadow space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <h3 className="font-headline text-xl text-primary font-medium">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Vitrified Floor Slabs"
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. vitrified-floor-slabs"
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for customer guidance..."
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="cat-active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="cat-active" className="text-sm font-medium text-primary cursor-pointer">
                    Active on Showroom
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant rounded-lg font-label-caps text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-xs uppercase shadow hover:bg-neutral-800 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
