import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function generateReferenceCode(categoryName: string, existingCodes: string[]): string {
  const prefix = categoryName
    ? categoryName.substring(0, 2).toUpperCase()
    : 'TL';
  let counter = 101;
  let code = `${prefix}-${counter}`;
  while (existingCodes.includes(code)) {
    counter++;
    code = `${prefix}-${counter}`;
  }
  return code;
}

export function generateWhatsAppUrl(
  phone: string,
  productName: string,
  referenceCode: string,
  price: number,
  priceUnit: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Hello Berinag Tiles,

I am interested in:
*${productName}*
Reference Code: *${referenceCode}*
Price: *₹${price} / ${priceUnit}*

Please let me know if this design is available for inspection at your Berinag showroom.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
