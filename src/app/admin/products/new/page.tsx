'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Save, Send, ArrowLeft } from 'lucide-react';
import { Category, ProductAvailability, ProductStatus } from '@/types/database';
import { getCategoriesAction, getProductsAction } from '@/app/admin/actions';
import { ProductImageManager, ManagedImage } from '@/components/admin/ProductImageManager';
import { slugify, generateReferenceCode } from '@/lib/utils';
import { useToast } from '@/components/Toast';

const FINISH_PRESETS = ['Glossy', 'Matte', 'Satin', 'Honed', 'Polished', 'Leathered', 'Textured'];
const LOOK_PRESETS = ['Marble', 'Wood', 'Stone', 'Concrete', '3D', 'Terracotta'];
const SPACE_PRESETS = ['Living Room', 'Bathroom', 'Kitchen', 'Outdoor', 'Commercial'];

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('78');
  const [priceUnit, setPriceUnit] = useState('sq.ft');
  const [size, setSize] = useState('600 x 1200 mm');
  const [thickness, setThickness] = useState('9 mm');
  const [finish, setFinish] = useState('Glossy');
  const [color, setColor] = useState('White / Gold');
  const [material, setMaterial] = useState('Glazed Vitrified');
  const [look, setLook] = useState('Marble');
  const [space, setSpace] = useState('Living Room, Bathroom');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<ProductAvailability>('available');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<ManagedImage[]>([]);

  useEffect(() => {
    getCategoriesAction().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    }).catch(console.error);
    getProductsAction().then((prods) => {
      const existingCodes = prods.map((p) => p.reference_code);
      setReferenceCode(generateReferenceCode('Tile', existingCodes));
    }).catch(console.error);
  }, []);

  const handleSave = async (status: ProductStatus) => {
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }
    if (!referenceCode.trim()) {
      showToast('Reference code is required.', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Please select a category.', 'error');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: name.trim(),
        slug: slugify(name),
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
        status,
        featured,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));

      const formattedImages = images.map((img, idx) => ({
        id: img.id,
        url: img.id.startsWith('temp-') ? '' : img.url, // Don't send huge base64 strings in the JSON payload, we'll send it as a file if it's new
        altText: img.altText || name,
        sortOrder: idx + 1,
        isPrimary: img.isPrimary,
      }));
      
      formData.append('imagesData', JSON.stringify(formattedImages));
      
      // Append files for new images
      images.forEach((img) => {
        if (img.id.startsWith('temp-') && img.file) {
          formData.append(`file_${img.id}`, img.file);
        }
      });

      const { saveProductAction } = await import('@/app/admin/actions');
      const created = await saveProductAction(formData, true);

      showToast(
        status === 'published'
          ? `"${created?.name || name}" published to Digital Showroom!`
          : `Draft for "${created?.name || name}" saved.`
      );

      router.push('/admin/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to save product.', 'error');
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
          <span className="text-primary">Add New Tile</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-headline-lg tracking-tight font-normal text-primary">
              Add New Material / Tile
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mt-1 max-w-2xl">
              Capture or upload photos and enter technical specifications.
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

      {/* 2-COLUMN STITCH FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave('published');
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN: MAIN DATA (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* SECTION 1: BASIC INFO */}
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
                  placeholder="e.g. Oasis Marble 4D Slab"
                  className="w-full text-lg font-headline py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-caps text-xs text-on-surface-variant uppercase">
                  Reference Code * (Unique Showroom Tag)
                </label>
                <input
                  type="text"
                  required
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WP-482"
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
                  placeholder="e.g. Kajaria, Somany, Simpolo, Antolini"
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

          {/* SECTION 2: MOBILE CAMERA CAPTURE & PRODUCT IMAGERY */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-variant pb-4">
              <div>
                <h2 className="font-headline text-xl text-primary font-medium">
                  Material Imagery & Mobile Camera Capture
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Take photos on your phone or upload high-res texture shots.
                </p>
              </div>
              <span className="text-xs font-label-caps text-secondary">
                Auto-compressed for fast loading
              </span>
            </div>

            {/* INTEGRATED FIRST-CLASS IMAGE MANAGER */}
            <ProductImageManager
              images={images}
              onChange={(newImages) => setImages(newImages)}
              maxImages={8}
            />
          </section>

          {/* SECTION 3: ARCHITECTURAL DESCRIPTION */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant ambient-shadow space-y-4">
            <h2 className="font-headline text-xl text-primary font-medium border-b border-surface-variant pb-4">
              Architectural Description & Styling
            </h2>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe unique veining patterns, recommended light angles, mortar pairings, and visual impact..."
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-sm text-primary focus:border-primary focus:ring-0"
            />
          </section>
        </div>

        {/* RIGHT COLUMN: PRICING, SPECS, VISIBILITY (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* SECTION 4: PRICING */}
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
                  placeholder="78.00"
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

          {/* SECTION 5: TECHNICAL SPECS */}
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
                  placeholder="e.g. 600 x 1200 mm (4x2 ft)"
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
                  placeholder="e.g. 9 mm"
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
                  placeholder="e.g. White & Amber Gold"
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
                  placeholder="e.g. Glazed Vitrified Slab"
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
                  placeholder="e.g. Living Room, Bathroom"
                  className="w-full py-2 px-0 bg-transparent border-0 border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-primary text-sm"
                />
              </div>
            </div>
          </section>

          {/* SECTION 6: VISIBILITY & AVAILABILITY */}
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

        {/* STICKY BOTTOM ACTION BAR */}
        <div className="col-span-1 lg:col-span-12 sticky bottom-0 z-40 -mx-4 sm:-mx-8 md:-mx-margin-desktop px-4 sm:px-8 md:px-margin-desktop py-4 bg-background/95 backdrop-blur-md border-t border-surface-variant mt-8 flex justify-end gap-3 shadow-lg">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave('draft')}
            className="px-6 py-3.5 rounded-lg border border-outline-variant font-label-caps text-xs text-on-surface hover:bg-surface-variant transition-colors bg-surface-container-lowest uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-caps text-xs hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow uppercase tracking-wider disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish to Digital Showroom'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
