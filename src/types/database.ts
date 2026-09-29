export type ProductAvailability = 'available' | 'unavailable' | 'low_stock';
export type ProductStatus = 'published' | 'draft';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string | null;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  reference_code: string;
  brand: string | null;
  category_id: string;
  category?: Category;
  price: number;
  price_unit: string; // e.g. 'sq.ft', 'piece', 'sq.m', 'box'
  size: string | null; // e.g. '600x1200 mm', '4x2 ft'
  thickness: string | null; // e.g. '9 mm', '18 mm'
  finish: string | null; // e.g. 'Glossy', 'Matte', 'Satin', 'Honed', 'Polished', 'Leathered'
  color: string | null; // e.g. 'White', 'Beige', 'Grey', 'Black', 'Oak'
  material: string | null; // e.g. 'Glazed Vitrified', 'Natural Marble', 'Porcelain Slab', 'Ceramic'
  look: string | null; // e.g. 'Marble', 'Wood', 'Stone', 'Concrete', '3D', 'Luxury', 'Terracotta'
  space: string | null; // e.g. 'Living Room', 'Bathroom', 'Kitchen', 'Outdoor', 'Commercial'
  description: string | null;
  availability: ProductAvailability;
  status: ProductStatus;
  featured: boolean;
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ShopSettings {
  id: string;
  shop_name: string;
  tagline: string | null;
  logo_url: string | null;
  description: string | null;
  phone: string;
  whatsapp: string;
  address: string;
  maps_url: string;
  opening_hours: string;
  instagram_url: string | null;
  facebook_url: string | null;
  hero_image_url: string | null;
  updated_at: string;
}

export interface FilterState {
  search?: string;
  category?: string;
  look?: string[];
  finish?: string[];
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
}
