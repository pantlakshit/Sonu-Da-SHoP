import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Category, FilterState, Product, ProductImage, ShopSettings } from '@/types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SHOP_SETTINGS } from './initial-seed';
import { slugify } from '../utils';

// Check if Supabase environment is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isSupabaseConfigured
  ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Local store for development/bootstrap resilience
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memorySettings: ShopSettings = { ...INITIAL_SHOP_SETTINGS };

function getStoredProducts(): Product[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('berinag_products');
    if (saved) {
      try {
        memoryProducts = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored products', e);
      }
    }
  }
  return memoryProducts;
}

function saveProductsToStorage(products: Product[]) {
  memoryProducts = products;
  if (typeof window !== 'undefined') {
    localStorage.setItem('berinag_products', JSON.stringify(products));
  }
}

function getStoredCategories(): Category[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('berinag_categories');
    if (saved) {
      try {
        memoryCategories = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored categories', e);
      }
    }
  }
  return memoryCategories;
}

function saveCategoriesToStorage(cats: Category[]) {
  memoryCategories = cats;
  if (typeof window !== 'undefined') {
    localStorage.setItem('berinag_categories', JSON.stringify(cats));
  }
}

function getStoredSettings(): ShopSettings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('berinag_settings');
    if (saved) {
      try {
        memorySettings = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored settings', e);
      }
    }
  }
  return memorySettings;
}

function saveSettingsToStorage(settings: ShopSettings) {
  memorySettings = settings;
  if (typeof window !== 'undefined') {
    localStorage.setItem('berinag_settings', JSON.stringify(settings));
  }
}

export const Repository = {
  // 1. PRODUCTS
  async getProducts(filters?: FilterState): Promise<Product[]> {
    if (supabase) {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `);

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters?.availability) {
        query = query.eq('availability', filters.availability);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      let list: Product[] = (data || []).map((p: any) => ({
        ...p,
        images: (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      }));

      // Apply in-memory search/look/finish filters if not matched by exact query
      if (filters?.look && filters.look.length > 0) {
        list = list.filter((p) => p.look && filters.look?.includes(p.look));
      }
      if (filters?.finish && filters.finish.length > 0) {
        list = list.filter((p) => p.finish && filters.finish?.includes(p.finish));
      }
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference_code.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          (p.look && p.look.toLowerCase().includes(q)) ||
          (p.finish && p.finish.toLowerCase().includes(q))
        );
      }

      // Sort
      if (filters?.sortBy === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (filters?.sortBy === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (filters?.sortBy === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      return list;
    }

    // Local Store Flow
    let list = [...getStoredProducts()];
    const categories = getStoredCategories();

    list = list.map((p) => ({
      ...p,
      category: categories.find((c) => c.id === p.category_id),
      images: (p.images || []).sort((a, b) => a.sort_order - b.sort_order),
    }));

    if (!filters) return list;

    if (filters.category) {
      const cat = categories.find((c) => c.slug === filters.category || c.id === filters.category);
      if (cat) {
        list = list.filter((p) => p.category_id === cat.id);
      }
    }

    if (filters.look && filters.look.length > 0) {
      list = list.filter((p) => p.look && filters.look?.includes(p.look));
    }

    if (filters.finish && filters.finish.length > 0) {
      list = list.filter((p) => p.finish && filters.finish?.includes(p.finish));
    }

    if (filters.availability) {
      list = list.filter((p) => p.availability === filters.availability);
    }

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
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.space && p.space.toLowerCase().includes(q))
        );
      });
    }

    if (filters.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  },

  async getPublishedProducts(filters?: FilterState): Promise<Product[]> {
    const all = await this.getProducts(filters);
    return all.filter((p) => p.status === 'published');
  },

  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    const published = await this.getPublishedProducts();
    return published.filter((p) => p.featured).slice(0, limit);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      };
    }

    const list = await this.getProducts();
    const product = list.find((p) => p.slug === slug);
    return product || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      };
    }

    const list = await this.getProducts();
    const product = list.find((p) => p.id === id);
    return product || null;
  },

  async getRelatedProducts(currentProduct: Product, limit = 4): Promise<Product[]> {
    const all = await this.getPublishedProducts();
    return all
      .filter((p) => p.id !== currentProduct.id)
      .filter(
        (p) =>
          p.category_id === currentProduct.category_id ||
          p.look === currentProduct.look ||
          p.finish === currentProduct.finish
      )
      .slice(0, limit);
  },

  async createProduct(
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
    images: { url: string; altText: string; sortOrder: number; isPrimary: boolean }[] = []
  ): Promise<Product> {
    if (supabase) {
      // 1. Insert product
      const { data: insertedProduct, error: prodError } = await supabase
        .from('products')
        .insert({
          name: data.name,
          slug: data.slug,
          reference_code: data.reference_code.toUpperCase().trim(),
          brand: data.brand,
          category_id: data.category_id,
          price: data.price,
          price_unit: data.price_unit,
          size: data.size,
          thickness: data.thickness,
          finish: data.finish,
          color: data.color,
          material: data.material,
          look: data.look,
          space: data.space,
          description: data.description,
          availability: data.availability,
          status: data.status,
          featured: data.featured,
        })
        .select()
        .single();

      if (prodError) throw new Error(`Failed to create product: ${prodError.message}`);

      // 2. Insert image records
      if (images.length > 0) {
        const imageInserts = images.map((img, idx) => ({
          product_id: insertedProduct.id,
          image_url: img.url,
          alt_text: img.altText || data.name,
          sort_order: img.sortOrder || idx + 1,
          is_primary: img.isPrimary ?? idx === 0,
        }));

        const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
        if (imgError) console.error('Error inserting images:', imgError);
      }

      return this.getProductById(insertedProduct.id) as Promise<Product>;
    }

    // Local storage flow
    const products = getStoredProducts();

    if (products.some((p) => p.reference_code.toUpperCase() === data.reference_code.toUpperCase())) {
      throw new Error(`Reference code "${data.reference_code}" is already in use.`);
    }

    let baseSlug = data.slug || slugify(data.name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (products.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newId = 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();

    const formattedImages: ProductImage[] = images.map((img, idx) => ({
      id: 'img-' + Date.now() + '-' + idx,
      product_id: newId,
      storage_path: null,
      image_url: img.url,
      alt_text: img.altText || data.name,
      sort_order: img.sortOrder || idx + 1,
      is_primary: img.isPrimary ?? idx === 0,
      created_at: now,
    }));

    const newProduct: Product = {
      ...data,
      id: newId,
      slug: finalSlug,
      reference_code: data.reference_code.toUpperCase().trim(),
      created_at: now,
      updated_at: now,
      images: formattedImages,
    };

    saveProductsToStorage([newProduct, ...products]);
    return newProduct;
  },

  async updateProduct(
    id: string,
    data: Partial<Product>,
    images?: { id?: string; url: string; altText: string; sortOrder: number; isPrimary: boolean }[]
  ): Promise<Product> {
    if (supabase) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw new Error(`Failed to update product: ${updateError.message}`);

      if (images) {
        // Delete old and re-insert images
        await supabase.from('product_images').delete().eq('product_id', id);
        const imageInserts = images.map((img, idx) => ({
          product_id: id,
          image_url: img.url,
          alt_text: img.altText || data.name,
          sort_order: img.sortOrder || idx + 1,
          is_primary: img.isPrimary ?? idx === 0,
        }));
        await supabase.from('product_images').insert(imageInserts);
      }

      return this.getProductById(id) as Promise<Product>;
    }

    // Local storage flow
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Product not found.');
    }

    const existing = products[index];

    if (
      data.reference_code &&
      data.reference_code.toUpperCase() !== existing.reference_code.toUpperCase() &&
      products.some((p) => p.id !== id && p.reference_code.toUpperCase() === data.reference_code?.toUpperCase())
    ) {
      throw new Error(`Reference code "${data.reference_code}" is already in use.`);
    }

    const now = new Date().toISOString();
    let updatedImages = existing.images || [];

    if (images) {
      updatedImages = images.map((img, idx) => ({
        id: img.id || 'img-' + Date.now() + '-' + idx,
        product_id: id,
        storage_path: null,
        image_url: img.url,
        alt_text: img.altText || existing.name,
        sort_order: img.sortOrder || idx + 1,
        is_primary: img.isPrimary ?? idx === 0,
        created_at: now,
      }));
    }

    const updatedProduct: Product = {
      ...existing,
      ...data,
      reference_code: (data.reference_code || existing.reference_code).toUpperCase().trim(),
      images: updatedImages,
      updated_at: now,
    };

    products[index] = updatedProduct;
    saveProductsToStorage([...products]);
    return updatedProduct;
  },

  async duplicateProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) throw new Error('Product not found for duplication.');

    const copySuffix = '-copy-' + Math.random().toString(36).substr(2, 4);
    const newRefCode = product.reference_code + '-COPY';

    const duplicateData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
      name: `${product.name} (Copy)`,
      slug: `${product.slug}${copySuffix}`,
      reference_code: newRefCode,
      brand: product.brand,
      category_id: product.category_id,
      price: product.price,
      price_unit: product.price_unit,
      size: product.size,
      thickness: product.thickness,
      finish: product.finish,
      color: product.color,
      material: product.material,
      look: product.look,
      space: product.space,
      description: product.description,
      availability: product.availability,
      status: 'draft',
      featured: false,
    };

    const duplicateImages = (product.images || []).map((img) => ({
      url: img.image_url,
      altText: img.alt_text || '',
      sortOrder: img.sort_order,
      isPrimary: img.is_primary,
    }));

    return this.createProduct(duplicateData, duplicateImages);
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(`Failed to delete product: ${error.message}`);
      return true;
    }

    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveProductsToStorage(filtered);
    return true;
  },

  // 2. CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw new Error(`Failed to load categories: ${error.message}`);
      return data || [];
    }

    const cats = getStoredCategories();
    return cats.sort((a, b) => a.sort_order - b.sort_order);
  },

  async getActiveCategories(): Promise<Category[]> {
    const cats = await this.getCategories();
    return cats.filter((c) => c.active);
  },

  async createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    if (supabase) {
      const { data: created, error } = await supabase
        .from('categories')
        .insert(data)
        .select()
        .single();

      if (error) throw new Error(`Failed to create category: ${error.message}`);
      return created;
    }

    const cats = getStoredCategories();
    const newCategory: Category = {
      ...data,
      id: 'cat-' + Date.now(),
      slug: data.slug || slugify(data.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveCategoriesToStorage([...cats, newCategory]);
    return newCategory;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    if (supabase) {
      const { data: updated, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update category: ${error.message}`);
      return updated;
    }

    const cats = getStoredCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found.');
    const updated = {
      ...cats[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    cats[idx] = updated;
    saveCategoriesToStorage([...cats]);
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error(`Failed to delete category: ${error.message}`);
      return true;
    }

    const cats = getStoredCategories();
    saveCategoriesToStorage(cats.filter((c) => c.id !== id));
    return true;
  },

  // 3. SHOP SETTINGS
  async getShopSettings(): Promise<ShopSettings> {
    if (supabase) {
      const { data, error } = await supabase.from('shop_settings').select('*').single();
      if (error) {
        if (error.code === 'PGRST116') return INITIAL_SHOP_SETTINGS;
        throw new Error(`Failed to load shop settings: ${error.message}`);
      }
      return data || INITIAL_SHOP_SETTINGS;
    }

    return getStoredSettings();
  },

  async updateShopSettings(data: Partial<ShopSettings>): Promise<ShopSettings> {
    if (supabase) {
      const current = await this.getShopSettings();
      const { data: updated, error } = await supabase
        .from('shop_settings')
        .update(data)
        .eq('id', current.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update settings: ${error.message}`);
      return updated;
    }

    const current = getStoredSettings();
    const updated = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };
    saveSettingsToStorage(updated);
    return updated;
  },
};
