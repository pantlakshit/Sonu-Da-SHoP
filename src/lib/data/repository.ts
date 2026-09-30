import { query, getBlobsStore, getClient } from './db';
import { Category, FilterState, Product, ProductImage, ShopSettings } from '@/types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SHOP_SETTINGS } from './initial-seed';
import { slugify } from '../utils';

// We'll rely on real PostgreSQL sequences and UUIDs now.
// For initial seed fallback when table is empty, we can just insert them.

export const Repository = {
  // 1. PRODUCTS
  async getProducts(filters?: FilterState): Promise<Product[]> {
    let sql = `
      SELECT p.*,
             row_to_json(c.*) as category,
             COALESCE(
               (SELECT json_agg(pi ORDER BY pi.sort_order)
                FROM product_images pi WHERE pi.product_id = p.id), '[]'::json
             ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.category && filters.category !== 'all') {
      sql += ` AND p.category_id = $${paramIndex++}`;
      params.push(filters.category);
    }
    if (filters?.availability && filters.availability !== 'all') {
      sql += ` AND p.availability = $${paramIndex++}`;
      params.push(filters.availability);
    }
    
    // The exact query matching logic can go here. For now we will fetch and filter in memory if complex, or just use basic SQL.
    const rows = await query(sql, params);
    
    let list = rows.map(row => ({
      ...row,
      images: row.images || []
    })) as Product[];

    // In-memory filters for complex/array searches
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
        (p.finish && p.finish.toLowerCase().includes(q)) ||
        (p.size && p.size.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.space && p.space.toLowerCase().includes(q))
      );
    }

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
    const rows = await query(`
      SELECT p.*,
             row_to_json(c.*) as category,
             COALESCE(
               (SELECT json_agg(pi ORDER BY pi.sort_order)
                FROM product_images pi WHERE pi.product_id = p.id), '[]'::json
             ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `, [slug]);
    
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getProductById(id: string): Promise<Product | null> {
    const rows = await query(`
      SELECT p.*,
             row_to_json(c.*) as category,
             COALESCE(
               (SELECT json_agg(pi ORDER BY pi.sort_order)
                FROM product_images pi WHERE pi.product_id = p.id), '[]'::json
             ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (rows.length === 0) return null;
    return rows[0];
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
    images: { url: string; altText: string; sortOrder: number; isPrimary: boolean; storagePath?: string }[] = []
  ): Promise<Product> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const pRes = await client.query(`
        INSERT INTO products (
          name, slug, reference_code, brand, category_id, price, price_unit,
          size, thickness, finish, color, material, look, space, description,
          availability, status, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
      `, [
        data.name, data.slug, data.reference_code.toUpperCase().trim(), data.brand, data.category_id,
        data.price, data.price_unit, data.size, data.thickness, data.finish,
        data.color, data.material, data.look, data.space, data.description,
        data.availability, data.status, data.featured
      ]);
      const productId = pRes.rows[0].id;

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await client.query(`
            INSERT INTO product_images (product_id, storage_path, image_url, alt_text, sort_order, is_primary)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [productId, img.storagePath || null, img.url, img.altText || data.name, img.sortOrder || i + 1, img.isPrimary ?? (i === 0)]);
        }
      }

      await client.query('COMMIT');
      return await this.getProductById(productId) as Product;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async updateProduct(
    id: string,
    data: Partial<Product>,
    images?: { id?: string; url: string; altText: string; sortOrder: number; isPrimary: boolean; storagePath?: string }[]
  ): Promise<Product> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Update product fields
      const updates = [];
      const values = [];
      let i = 1;
      for (const [key, val] of Object.entries(data)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'images' && key !== 'category') {
          updates.push(`${key} = $${i++}`);
          values.push(val);
        }
      }
      if (updates.length > 0) {
        updates.push(`updated_at = NOW()`);
        values.push(id);
        await client.query(`UPDATE products SET ${updates.join(', ')} WHERE id = $${i}`, values);
      }

      // Re-link images
      if (images) {
        await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
        for (let j = 0; j < images.length; j++) {
          const img = images[j];
          await client.query(`
            INSERT INTO product_images (product_id, storage_path, image_url, alt_text, sort_order, is_primary)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [id, img.storagePath || null, img.url, img.altText, img.sortOrder || j + 1, img.isPrimary ?? (j === 0)]);
        }
      }

      await client.query('COMMIT');
      return await this.getProductById(id) as Product;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async duplicateProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) throw new Error('Product not found for duplication.');

    const copySuffix = '-copy-' + Math.random().toString(36).substring(2, 6);
    const newRefCode = product.reference_code + copySuffix.toUpperCase();

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
      storagePath: img.storage_path || undefined
    }));

    return this.createProduct(duplicateData, duplicateImages);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProductById(id);
    if (product && product.images && product.images.length > 0) {
      try {
        const store = await getBlobsStore();
        for (const img of product.images) {
          if (img.storage_path) {
            await store.delete(img.storage_path);
          }
        }
      } catch (err) {
        console.error('Failed to clean up blobs on product deletion:', err);
      }
    }
    await query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  },

  // 2. CATEGORIES
  async getCategories(): Promise<Category[]> {
    const rows = await query('SELECT * FROM categories ORDER BY sort_order ASC');
    return rows;
  },

  async getActiveCategories(): Promise<Category[]> {
    const rows = await query('SELECT * FROM categories WHERE active = true ORDER BY sort_order ASC');
    return rows;
  },

  async createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const res = await query(`
      INSERT INTO categories (name, slug, description, image_url, active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [data.name, data.slug, data.description, data.image_url, data.active, data.sort_order]);
    return res[0];
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const updates = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        updates.push(`${key} = $${i++}`);
        values.push(val);
      }
    }
    updates.push(`updated_at = NOW()`);
    values.push(id);
    const res = await query(`UPDATE categories SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`, values);
    return res[0];
  },

  async deleteCategory(id: string): Promise<boolean> {
    await query('DELETE FROM categories WHERE id = $1', [id]);
    return true;
  },

  // 3. SHOP SETTINGS
  async getShopSettings(): Promise<ShopSettings> {
    const rows = await query('SELECT * FROM shop_settings LIMIT 1');
    if (rows.length === 0) {
      return INITIAL_SHOP_SETTINGS;
    }
    return rows[0];
  },

  async updateShopSettings(data: Partial<ShopSettings>): Promise<ShopSettings> {
    const rows = await query('SELECT id FROM shop_settings LIMIT 1');
    if (rows.length === 0) {
      throw new Error('No settings row found');
    }
    const id = rows[0].id;
    
    const updates = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        updates.push(`${key} = $${i++}`);
        values.push(val);
      }
    }
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const res = await query(`UPDATE shop_settings SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`, values);
    return res[0];
  }
};
