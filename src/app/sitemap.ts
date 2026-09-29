import { MetadataRoute } from 'next';
import { Repository } from '@/lib/data/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://berinagtiles.com';

  const [products, categories] = await Promise.all([
    Repository.getPublishedProducts(),
    Repository.getActiveCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tiles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/tiles/${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/tiles?category=${cat.slug}`,
    lastModified: new Date(cat.updated_at || cat.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
