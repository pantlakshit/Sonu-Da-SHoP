'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Save, Send, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { Category, Product, ProductAvailability, ProductStatus } from '@/types/database';
import { getCategoriesAction } from '@/app/admin/actions';
import { ProductImageManager, ManagedImage } from '@/components/admin/ProductImageManager';
import { useToast } from '@/components/Toast';

const FINISH_PRESETS = ['Glossy', 'Matte', 'Satin', 'Honed', 'Polished', 'Leathered', 'Textured'];
const LOOK_PRESETS = ['Marble', 'Wood', 'Stone', 'Concrete', '3D', 'Terracotta'];

interface EditProductClientProps {
  initialProduct: Product;
  categories: Category[];
}

export function EditProductClient({
  initialProduct,
  categories,
}: EditProductClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  // Form State initialized with existing product data
  const [name, setName] = useState(initialProduct.name);
  const [referenceCode, setReferenceCode] = useState(initialProduct.reference_code);
  const [brand, setBrand] = useState(initialProduct.brand || '');
  const [categoryId, setCategoryId] = useState(initialProduct.category_id);
  const [price, setPrice] = useState(initialProduct.price.toString());
  const [priceUnit, setPriceUnit] = useState(initialProduct.price_unit);
  const [size, setSize] = useState(initialProduct.size || '');
  const [thickness, setThickness] = useState(initialProduct.thickness || '');
  const [finish, setFinish] = useState(initialProduct.finish || '');
  const [color, setColor] = useState(initialProduct.color || '');
  const [material, setMaterial] = useState(initialProduct.material || '');
  const [look, setLook] = useState(initialProduct.look || '');
  const [space, setSpace] = useState(initialProduct.space || '');
  const [description, setDescription] = useState(initialProduct.description || '');
  const [availability, setAvailability] = useState<ProductAvailability>(initialProduct.availability);
  const [status, setStatus] = useState<ProductStatus>(initialProduct.status);
  const [featured, setFeatured] = useState(initialProduct.featured);

  // Initialize images
  const [images, setImages] = useState<ManagedImage[]>(
    (initialProduct.images || []).map((img, idx) => ({
      id: img.id,
      url: img.image_url,
      altText: img.alt_text || initialProduct.name,
      tag: 'Gallery Photo',
      isPrimary: img.is_primary ?? idx === 0,
      sortOrder: img.sort_order || idx + 1,
    }))
  );

  const handleUpdate = async (targetStatus?: ProductStatus) => {
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }
    if (!referenceCode.trim()) {
      showToast('Reference code is required.', 'error');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: name.trim(),
        reference_code: referenceCode.trim().toUpperCase(),
        brand: brand.trim() || null,
        category_id: categoryId,
        price: parseFloat(price) || 0,
        price_unit: priceUnit,
        size: size.trim() || null,
        thickness: thickness.trim() || null,
        finish: finish.trim() || null,
        color: color.trim() || null,
        material: material.trim() || null,
        look: look.trim() || null,
        space: space.trim() || null,
        description: description.trim() || null,
        availability,
        status: targetStatus || status,
        featured,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(updateData));

      const formattedImages = images.map((img, idx) => ({
        id: img.id.startsWith('temp-') ? img.id : img.id,
        url: img.id.startsWith('temp-') ? '' : img.url,
        altText: img.altText || name,
        sortOrder: idx + 1,
        isPrimary: img.isPrimary,
      }));

      formData.append('imagesData', JSON.stringify(formattedImages));

      images.forEach((img) => {
        if (img.id.startsWith('temp-') && img.file) {
          formData.append(`file_${img.id}`, img.file);
        }
      });

      const { saveProductAction } = await import('@/app/admin/actions');
      await saveProductAction(formData, false, initialProduct.id);

      showToast(`Updated "${name}" successfully! Changes are live on the showroom catalogue.`);
      router.push('/admin/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to update product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pt-4 pb-32 px-4 sm:px-8 md:px-margin-desktop max-w-container-max mx-auto">
      {/* BREADCRUMB & HEADER */}
      <header className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-on-surface-variant mb-4 font-label-caps text-xs">
          <Link href="/admin/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary">Edit: {initialProduct.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg tracking-tight font-normal text-primary">
                Edit {initialProduct.name}
              </h1>
              <Link
                href={`/tiles/${initialProduct.slug}`}
                target="_blank"
                className="p-2 text-secondary hover:text-primary border border-outline-variant rounded-lg text-xs font-label-caps flex items-center gap-1"
                title="View live page"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="font-body text-body-md text-on-surface-variant mt-1">
              Update pricing, dimensions, stock availability, and manage camera photos.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-xs font-label-caps text-secondary hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </header>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* BASIC INFO */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-6">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-lg font-headline py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Reference Code * (Showroom Tag)
                </label>
                <input
                  type="text"
                  required
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Primary Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* MOBILE CAMERA & IMAGE MANAGEMENT */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-variant pb-4">
              <div>
                <h2 className="font-headline text-xl text-primary font-medium">
                  Material Imagery & Camera Photos
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Take fresh photos with your phone camera or upload extra room shots.
                </p>
              </div>
            </div>

            <ProductImageManager
              images={images}
              onChange={(newImages) => setImages(newImages)}
              maxImages={8}
            />
          </section>

          {/* DESCRIPTION */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-4">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Architectural Description
            </h2>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
            />
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* PRICING */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-4">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Showroom Pricing
            </h2>
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-lg font-headline py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary"
                />
              </div>

              <div className="w-28 space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Unit
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                >
                  <option value="sq.ft">sq.ft</option>
                  <option value="piece">piece</option>
                  <option value="sq.m">sq.m</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>
          </section>

          {/* TECHNICAL SPECS */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-6">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Technical Specs
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Dimensions (L x W)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Thickness
                </label>
                <input
                  type="text"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>

              {/* Surface Finish Pill Selectors */}
              <div className="space-y-2">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Surface Finish
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FINISH_PRESETS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFinish(f)}
                      className={`px-3 py-1 rounded-full text-xs font-label-caps transition-colors ${
                        finish === f
                          ? 'bg-primary text-on-primary font-medium'
                          : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Look Pill Selectors */}
              <div className="space-y-2">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Aesthetic Look
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LOOK_PRESETS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLook(l)}
                      className={`px-3 py-1 rounded-full text-xs font-label-caps transition-colors ${
                        look === l
                          ? 'bg-primary text-on-primary font-medium'
                          : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Base Color Family
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Material Classification
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Recommended Space
                </label>
                <input
                  type="text"
                  value={space}
                  onChange={(e) => setSpace(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>
            </div>
          </section>

          {/* VISIBILITY & STATUS */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-6">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Availability & Display
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Stock Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                >
                  <option value="available">In Stock (Showroom Ready)</option>
                  <option value="low_stock">Limited Stock (Confirm Before Visit)</option>
                  <option value="unavailable">Showroom Display Only (Pre-order)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
                >
                  <option value="published">Published (Visible Publicly)</option>
                  <option value="draft">Draft (Hidden from Public)</option>
                </select>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-body text-sm font-medium text-primary">Mark as Featured</h3>
                  <p className="text-xs text-on-surface-variant">Display on showroom homepage highlights</p>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </section>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="col-span-1 lg:col-span-12 sticky bottom-0 z-40 -mx-4 sm:-mx-8 md:-mx-margin-desktop px-4 sm:px-8 md:px-margin-desktop py-4 bg-background/95 backdrop-blur-md border-t border-surface-variant mt-8 flex justify-end gap-3 shadow-lg">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleUpdate('draft')}
            className="px-6 py-3.5 rounded-lg border border-outline-variant font-label-caps text-xs text-on-surface hover:bg-surface-variant transition-colors bg-surface-container-lowest uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-caps text-xs hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow uppercase tracking-wider disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
