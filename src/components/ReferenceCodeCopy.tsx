'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface ReferenceCodeCopyProps {
  code: string;
}

export function ReferenceCodeCopy({ code }: ReferenceCodeCopyProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`Reference Code "${code}" copied to clipboard! Share it with our showroom staff.`);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-surface-container-low border border-outline-variant rounded-xl">
      <div className="flex-1">
        <span className="block text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant">
          SHOWROOM REFERENCE CODE
        </span>
        <span className="font-headline text-lg font-bold text-primary tracking-wider">
          {code}
        </span>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-lg text-xs font-label-caps text-primary transition-all shadow-sm active:scale-95"
        title="Copy reference code"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-600">COPIED</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-secondary" />
            <span>COPY CODE</span>
          </>
        )}
      </button>
    </div>
  );
}
