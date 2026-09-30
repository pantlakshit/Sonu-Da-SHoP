'use server';

import { revalidatePath } from 'next/cache';
import { Repository } from '@/lib/data/repository';
import { encryptSession, requireAdmin } from '@/lib/auth';
import { Product, Category, ShopSettings } from '@/types/database';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/data/db';

export async function getCategoriesAction() {
  await requireAdmin();
  return await Repository.getCategories();
}

export async function getProductsAction() {
  await requireAdmin();
  return await Repository.getProducts();
}

const loginAttempts = new Map<string, { count: number, resetTime: number }>();

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic rate limiting (5 attempts per minute per email)
  const now = Date.now();
  const attempt = loginAttempts.get(email) || { count: 0, resetTime: now + 60000 };
  
  if (now > attempt.resetTime) {
    attempt.count = 1;
    attempt.resetTime = now + 60000;
  } else {
    attempt.count++;
  }
  
  loginAttempts.set(email, attempt);

  if (attempt.count > 5) {
    return { error: 'Too many login attempts. Please try again in a minute.' };
  }

  // Real authentication check
  let isValid = false;
  
  // 1. Check against Environment variables (Primary source of truth for owner)
  if (
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD &&
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    isValid = true;
  } else {
    // 2. Fallback to DB check if profiles table has them
    try {
      const rows = await query('SELECT * FROM profiles WHERE email = $1 AND role = $2', [email, 'admin']);
      if (rows.length > 0 && rows[0].password_hash) {
        isValid = await bcrypt.compare(password, rows[0].password_hash);
      }
    } catch (e) {
      // Table might not exist or error
    }
  }

  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  // Create JWT session
  const sessionString = await encryptSession({
    adminId: 'admin',
    email,
    role: 'admin'
  });

  cookies().set('karki_admin_session', sessionString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });

  return { success: true };
}

export async function logOutAction() {
  cookies().delete('karki_admin_session');
  return { success: true };
}

export async function duplicateProductAction(id: string) {
  await requireAdmin();
  const product = await Repository.duplicateProduct(id);
  revalidatePath('/admin/products');
  revalidatePath('/tiles');
  return product;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await Repository.deleteProduct(id);
  revalidatePath('/admin/products');
  revalidatePath('/tiles');
}

export async function createCategoryAction(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  await requireAdmin();
  const cat = await Repository.createCategory(data);
  revalidatePath('/admin/categories');
  revalidatePath('/tiles');
  return cat;
}

export async function updateCategoryAction(id: string, data: Partial<Category>) {
  await requireAdmin();
  const cat = await Repository.updateCategory(id, data);
  revalidatePath('/admin/categories');
  revalidatePath('/tiles');
  return cat;
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  // Check if products exist for this category
  const products = await Repository.getProducts({ category: id });
  if (products.length > 0) {
    throw new Error('Cannot delete category. It is currently in use by one or more products. Reassign or delete those products first.');
  }
  
  await Repository.deleteCategory(id);
  revalidatePath('/admin/categories');
  revalidatePath('/tiles');
}

export async function updateSettingsAction(data: Partial<ShopSettings>) {
  await requireAdmin();
  const settings = await Repository.updateShopSettings(data);
  revalidatePath('/', 'layout');
  return settings;
}

export async function saveProductAction(formData: FormData, isNew: boolean, id?: string) {
  await requireAdmin();
  
  const productData = JSON.parse(formData.get('productData') as string);
  const rawImages = JSON.parse(formData.get('imagesData') as string) as any[];
  
  // Handle files attached in FormData
  const processedImages = [];
  const { put } = await import('@vercel/blob');
  
  for (let i = 0; i < rawImages.length; i++) {
    const imgInfo = rawImages[i];
    let storagePath = imgInfo.storagePath;
    let url = imgInfo.url;
    
    if (imgInfo.id && imgInfo.id.startsWith('temp-')) {
      const file = formData.get(`file_${imgInfo.id}`) as File;
      if (file) {
        const ext = file.type.split('/')[1] || 'jpg';
        const key = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        
        const blob = await put(key, file, {
          access: 'public',
        });
        
        storagePath = blob.url; // Use Vercel blob URL as storage path
        url = blob.url; // Direct URL
      }
    }
    
    processedImages.push({
      id: imgInfo.id && !imgInfo.id.startsWith('temp-') ? imgInfo.id : undefined,
      url,
      altText: imgInfo.altText,
      sortOrder: imgInfo.sortOrder,
      isPrimary: imgInfo.isPrimary,
      storagePath
    });
  }
  
  let result;
  if (isNew) {
    result = await Repository.createProduct(productData, processedImages);
  } else if (id) {
    result = await Repository.updateProduct(id, productData, processedImages);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/tiles');
  if (result) {
    revalidatePath(`/tiles/${result.slug}`);
  }
  
  return result;
}
