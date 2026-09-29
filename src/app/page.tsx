import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Phone, MessageSquare, Shield, Eye, Layers } from 'lucide-react';
import { Repository } from '@/lib/data/repository';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    Repository.getPublishedProducts(),
    Repository.getActiveCategories(),
    Repository.getShopSettings(),
  ]);

  const newArrivals = products.slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  const lookCollections = [
    {
      title: 'Marble & Onyx',
      description: 'Bookmatched veining & mirror gloss slabs',
      look: 'Marble',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8GfVJJZJmZ9ZSSrVYM3rnPOvMs9FxiHJGEYhjRh6ZmoAEqYEIZBnt95fca9ub-4Xd4tD7D0UJbjF9yuTBeMsX09gRqsPvlgSIzcl22aWrXbi9hvJJa1v9jb47Jv6h1jpuP4VLmDZOJAGl3EgXrT9G99f1O1vVbZZf1xUcd7z8yYcaUHLcN6QNuIpqJ6RX3hztvOgSQl9ZzFQSUNuABldyafnPO2lKr5kfeuj4SLbOI_ee3c8M-3jG',
    },
    {
      title: 'Natural Wood Planks',
      description: 'Tactile Scandinavian timber grains',
      look: 'Wood',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqlx5aIIre4fa6RNJStFHmm91sPEZA9P5dt2kkOBcceDOmJLQ7FrzBm4_qiwYxxrRymEd7WP5Uw4sREOglo1fpdAlqHJA5WOAzVTHyT2R2tz6MgMKjcxz9V9eDTX2fd21hOWFOcyImayBI0N2-YaeMcUkeuF43cfoLjsRTsI2g3LMk7LrhW7Fd11PxjDUDqNZX-k50mLHu_ZUNIkFu8zKBHE0pObJzQWxk3Uct5WsIFzFz2kq5Da71',
    },
    {
      title: 'Industrial Concrete',
      description: 'Seamless minimal matte & satin surfaces',
      look: 'Concrete',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA36n8xNhgDpb1CX-UgrkIRrhJekl5kbE-Iuwpe3rygE58TOl4h9PiZZUPSUjChKiB5V0BW2a740eUFhrKd1RZSKORsvnU7EyT80G0fkyt4gs0HnQtjaFj4Dc7Wmz6FVw3qujO1dHffOKiweEMMQ_xTFzQKkQBsvFlpDHPaRWxvkC5cvwIkW3yJa1LL3ZcqSepsHSwvabRD357YUT6Tp5Ve3A7meUQR34XQP7QIqDDdF_Z5lbm9gYqf',
    },
    {
      title: 'Cleft Mountain Slate',
      description: 'R11 anti-skid heavy stone textures',
      look: 'Stone',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZq8O2KN9tbddrBtvh3Ek5Vwsm9bo4zH7GFD60bE7JnnGgAqbqyu9odR9qWSUl1d2jBsC_5sO6nOME4f7ohKBhZMSX18YWIjX7vZWwnYtMT-IrLrfRMtp-BlUb_4fYSRdeRl0yn6UTSJdj1HqaOyN3bbvAYsGtURgdL7_0ccxeWbRg5gwXftdP7sU2Lm0AakfxVPVhp5ynapsniwyHYvfMttnjtqFvosq4ZHladzcdEYmjWmEMByST',
    },
  ];

  const spaceCollections = [
    { name: 'Living Room', desc: 'Grand large-format floor slabs' },
    { name: 'Bathroom & Spa', desc: 'Anti-skid & luxury wall decors' },
    { name: 'Kitchen & Backsplash', desc: 'Stain-resistant high-heat tiles' },
    { name: 'Outdoor & Balcony', desc: 'Weather-proof mountain paving' },
  ];

  return (
    <main className="w-full max-w-container-max mx-auto">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full h-[640px] sm:h-[720px] md:h-[800px] flex items-center justify-center px-margin-mobile md:px-margin-desktop my-6 md:my-10">
        <div className="absolute inset-0 z-0 px-margin-mobile md:px-margin-desktop">
          <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.hero_image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gbf1XGyyziojK0lIUe-0R8sYLQJxJOD9XBwwjqyCDRIJQv5XNmG0l3mfPZw2F79XfytuPe0P6hh6M5WbJll9Z8yc4GwZSYEVAvXyNADfcJjYl2BBDIionywoX8LFCgnMcF0KgDr4sVNEPJCgNJfYRIREN4FRjwkO_n84W-nl9BgOA6CxfCva6MNAAlOnnblIxHdbW2wFZgUawgsP0qHW1VRc3FCH9j22kHzf4X2HV1CG_IRctFfY'}
              alt="Berinag Showroom Architectural Space"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"></div>
          </div>
        </div>

        {/* Editorial Floating Card */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 sm:px-12 py-10 sm:py-16 bg-surface/95 backdrop-blur-md rounded-2xl ambient-shadow-lg border border-outline-variant/40">
          <div className="inline-block font-label-caps text-xs tracking-widest text-secondary uppercase mb-3 border border-outline-variant px-3 py-1 rounded-full">
            BERINAG • UTTARAKHAND
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-headline-display tracking-tight text-primary mb-6 leading-tight">
            Find a design you love. See it online. Feel it in our showroom.
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium tiles and building materials from the heart of Berinag. Browse digitally, note your reference code, and visit us to inspect the real materials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tiles"
              className="w-full sm:w-auto bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase px-8 py-4 rounded hover:bg-neutral-800 transition-colors shadow-md text-center"
            >
              EXPLORE TILES
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-transparent border border-outline text-primary font-label-caps text-label-caps tracking-widest uppercase px-8 py-4 rounded hover:bg-surface-variant transition-colors text-center"
            >
              VISIT SHOWROOM
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS */}
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-headline text-3xl md:text-headline-lg text-primary tracking-tight mb-2">
              New Arrivals
            </h2>
            <p className="font-body text-body-md text-on-surface-variant">
              The latest architectural designs and slab shipments in our showroom.
            </p>
          </div>
          <Link
            href="/tiles"
            className="hidden md:flex items-center gap-2 text-primary font-label-caps text-label-caps tracking-widest hover:underline uppercase"
          >
            VIEW ALL ({products.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/tiles"
            className="inline-block w-full py-4 border border-outline text-primary font-label-caps text-xs tracking-widest uppercase rounded"
          >
            VIEW ALL DESIGNS ({products.length})
          </Link>
        </div>
      </section>

      {/* 3. BROWSE BY LOOK */}
      <section className="py-16 bg-surface-container-low px-margin-mobile md:px-margin-desktop rounded-2xl my-12 border border-outline-variant/60">
        <div className="max-w-3xl mb-12">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
            AESTHETIC TAXONOMY
          </span>
          <h2 className="font-headline text-3xl md:text-headline-lg text-primary tracking-tight mt-1 mb-3">
            Browse by Look
          </h2>
          <p className="font-body text-body-md text-on-surface-variant">
            Explore tile collections categorized by authentic architectural material textures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lookCollections.map((col) => (
            <Link
              key={col.look}
              href={`/tiles?look=${encodeURIComponent(col.look)}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-high block shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="font-label-caps text-[10px] tracking-widest uppercase text-white/70">
                  LOOK
                </span>
                <h3 className="font-headline text-xl font-medium">{col.title}</h3>
                <p className="font-body text-xs text-white/80 mt-1">{col.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-label-caps text-white group-hover:underline">
                  EXPLORE <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BROWSE BY SPACE */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-label-caps text-xs text-secondary tracking-widest uppercase">
            APPLICATION
          </span>
          <h2 className="font-headline text-3xl md:text-headline-lg text-primary tracking-tight mt-1">
            Browse by Space
          </h2>
          <p className="font-body text-body-md text-on-surface-variant mt-2">
            Tailored tile dimensions and surface durability engineered for specific areas.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {spaceCollections.map((space) => (
            <Link
              key={space.name}
              href={`/tiles?search=${encodeURIComponent(space.name)}`}
              className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all group ambient-shadow"
            >
              <h3 className="font-headline text-lg text-primary font-medium group-hover:underline">
                {space.name}
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-2">{space.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. WHY USE OUR DIGITAL CATALOGUE */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop border-t border-outline-variant my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl text-primary font-medium">Browse Without Pressure</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              Explore hundreds of tile designs, finishes and real pricing from the comfort of your home before making a trip.
            </p>
          </div>

          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl text-primary font-medium">Unique Reference Codes</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              Every design has a reference code (e.g. WP-482). Simply note or copy the code to immediately see the physical sample at our counter.
            </p>
          </div>

          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl ambient-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl text-primary font-medium">Feel the Real Texture</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              Online discovery is just step one. Visit our Berinag showroom to physically touch the honed, matte, or gloss textures before ordering.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VISIT OUR SHOWROOM BANNER */}
      <section className="my-16 px-margin-mobile md:px-margin-desktop">
        <div className="bg-primary text-on-primary rounded-2xl p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <span className="font-label-caps text-xs tracking-widest text-white/70 uppercase">
              BERINAG SHOWROOM
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-white tracking-tight">
              Visit us to touch and inspect all designs in person.
            </h2>
            <p className="font-body text-white/80 text-body-md">
              Located at Main Market, Berinag. Open Monday through Sunday with complete installation displays.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span>Berinag, Uttarakhand</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span>9:00 AM - 7:30 PM</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a
              href="tel:+919412078456"
              className="px-8 py-4 bg-white text-primary rounded font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-100 transition-colors text-center shadow"
            >
              CALL SHOWROOM
            </a>
            <a
              href="https://wa.me/919412078456?text=Hello%20Berinag%20Tiles%2C%20I%20am%20planning%20to%20visit%20your%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 text-white rounded font-label-caps text-label-caps tracking-widest uppercase hover:bg-emerald-700 transition-colors text-center shadow"
            >
              WHATSAPP ENQUIRY
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
