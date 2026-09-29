'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone: string;
  productName: string;
  referenceCode: string;
  price: number;
  priceUnit: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  phone,
  productName,
  referenceCode,
  price,
  priceUnit,
  className,
  children,
}: WhatsAppButtonProps) {
  const url = generateWhatsAppUrl(phone, productName, referenceCode, price, priceUnit);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        'flex items-center justify-center gap-2.5 py-4 px-6 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl font-label-caps text-label-caps tracking-widest uppercase transition-all shadow-md active:scale-[0.99]'
      }
    >
      <MessageSquare className="w-5 h-5 text-white" />
      <span>{children || 'WHATSAPP ENQUIRY'}</span>
    </a>
  );
}
