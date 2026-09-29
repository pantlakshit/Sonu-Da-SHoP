'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Star, RefreshCw, Check, AlertCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { optimizeImageFile, formatFileSize, OptimizedImageResult } from '@/lib/image-optimizer';
import { ProductImage } from '@/types/database';

export interface ManagedImage {
  id: string;
  url: string;
  file?: File;
  altText: string;
  tag: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductImageManagerProps {
  images: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
  maxImages?: number;
}

const PHOTO_TAGS = [
  'Main Tile Photo',
  'Close-up / Texture',
  'Installed / Room View',
  'Detail / Edge',
  'Additional Angle'
];

export function ProductImageManager({
  images,
  onChange,
  maxImages = 8,
}: ProductImageManagerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [previewItem, setPreviewItem] = useState<{
    result: OptimizedImageResult;
    tag: string;
    altText: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  const handleFileProcessing = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const optimized = await optimizeImageFile(file, 2048, 2048, 0.85);
      
      // Default tag based on existing count
      const nextTagIndex = Math.min(images.length, PHOTO_TAGS.length - 1);
      const defaultTag = PHOTO_TAGS[nextTagIndex];

      setPreviewItem({
        result: optimized,
        tag: defaultTag,
        altText: `${defaultTag} - Berinag Tiles`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process the selected image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
    e.target.value = '';
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
    e.target.value = '';
  };

  const acceptPreviewPhoto = () => {
    if (!previewItem) return;

    const newImage: ManagedImage = {
      id: 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      url: previewItem.result.previewUrl,
      file: previewItem.result.file,
      altText: previewItem.altText,
      tag: previewItem.tag,
      isPrimary: images.length === 0,
      sortOrder: images.length + 1,
    };

    onChange([...images, newImage]);
    setPreviewItem(null);
  };

  const retakePhoto = () => {
    setPreviewItem(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleRemove = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    // If the removed image was primary, set first remaining as primary
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated.map((img, idx) => ({ ...img, sortOrder: idx + 1 })));
  };

  const handleSetPrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    onChange(newImages.map((img, idx) => ({ ...img, sortOrder: idx + 1 })));
  };

  return (
    <div className="space-y-6">
      {/* Hidden Native File Inputs */}
      {/* 1. Direct Back-Camera capture input for mobile devices */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
      />
      {/* 2. Gallery / Desktop File picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={handleGalleryChange}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={images.length >= maxImages || isProcessing}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps tracking-wider hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
        >
          <Camera className="w-5 h-5 text-white" />
          <span>TAKE PHOTO (CAMERA)</span>
        </button>

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={images.length >= maxImages || isProcessing}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-high text-on-surface border border-outline-variant rounded-xl font-label-caps text-label-caps tracking-wider hover:bg-surface-variant active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Upload className="w-5 h-5 text-secondary" />
          <span>UPLOAD FROM DEVICE</span>
        </button>
      </div>

      {isProcessing && (
        <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-xl text-body-md animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <span>Optimizing camera photo for showroom display...</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-error-container/20 border border-error/40 rounded-xl text-error text-body-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PHOTO PREVIEW REVIEW MODAL (Retake vs Use Photo) */}
      {previewItem && (
        <div className="p-6 bg-surface-container-lowest border-2 border-primary rounded-xl ambient-shadow space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <div>
              <h3 className="font-headline-md text-lg text-primary font-medium">Review Captured Photo</h3>
              <p className="text-sm text-on-surface-variant">Review before adding to product gallery</p>
            </div>
            <span className="text-xs font-label-caps px-3 py-1 bg-surface-container-high rounded-full text-secondary">
              {formatFileSize(previewItem.result.optimizedSize)} (Optimized)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.result.previewUrl}
                alt="Captured Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                  Photo Classification
                </label>
                <select
                  value={previewItem.tag}
                  onChange={(e) => setPreviewItem({ ...previewItem, tag: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus:border-primary focus:ring-0"
                >
                  {PHOTO_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                  Descriptive Label / Alt Text
                </label>
                <input
                  type="text"
                  value={previewItem.altText}
                  onChange={(e) => setPreviewItem({ ...previewItem, altText: e.target.value })}
                  placeholder="e.g. Oasis Marble close-up texture shot"
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus:border-primary focus:ring-0"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface hover:bg-surface-variant transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  RETAKE PHOTO
                </button>
                <button
                  type="button"
                  onClick={acceptPreviewPhoto}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:bg-neutral-800 transition-colors shadow-md"
                >
                  <Check className="w-4 h-4" />
                  USE PHOTO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY GRID */}
      {images.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              GALLERY PHOTOS ({images.length}/{maxImages})
            </span>
            <span className="text-xs text-secondary">
              First image is the main showroom catalog thumbnail
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-outline-variant bg-surface-container-low flex flex-col justify-between"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText || 'Product photo'}
                  className="w-full h-full object-cover"
                />

                {/* Primary Tag */}
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-on-primary text-[10px] font-label-caps px-2 py-1 rounded shadow">
                    PRIMARY
                  </div>
                )}

                {/* Tag Badge */}
                {img.tag && (
                  <div className="absolute bottom-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-white text-[9px] font-medium px-2 py-0.5 rounded truncate max-w-[80%]">
                    {img.tag}
                  </div>
                )}

                {/* Hover / Touch Controls Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setFullscreenUrl(img.url)}
                      className="p-1.5 bg-white/80 hover:bg-white text-primary rounded-full transition-colors"
                      title="View Fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(img.id)}
                      className="p-1.5 bg-error/90 hover:bg-error text-white rounded-full transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'left')}
                          className="p-1.5 bg-white/80 hover:bg-white text-primary rounded-full transition-colors"
                          title="Move earlier"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'right')}
                          className="p-1.5 bg-white/80 hover:bg-white text-primary rounded-full transition-colors"
                          title="Move later"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="px-2 py-1 bg-white/90 hover:bg-white text-primary rounded text-[10px] font-label-caps flex items-center gap-1 shadow"
                      >
                        <Star className="w-3 h-3" /> SET PRIMARY
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-lowest flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors p-4"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-label-caps text-center">+ Add Photo</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        !previewItem && (
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low">
            <Camera className="w-10 h-10 text-outline mx-auto mb-3" />
            <p className="font-body-md text-on-surface font-medium mb-1">
              No photos added yet
            </p>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto mb-4">
              Tap <strong>Take Photo</strong> from your phone camera or <strong>Upload</strong> from your gallery to add product views.
            </p>
          </div>
        )
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {fullscreenUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreenUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenUrl}
              alt="Expanded view"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
